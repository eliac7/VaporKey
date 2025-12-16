import cac from "cac";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import {
    encryptData,
    decryptData,
    generateKey,
    deriveKeyFromPassword,
    generateSalt,
    exportKey,
    importKey,
    bufferToString,
} from "@vaporkey/core";
import { storeSecret, retrieveSecret, API_BASE_URL } from "./api";

const cli = cac("vaporkey");

cli
    .command("share [secret]", "Share a secret securely")
    .option("-p, --password <password>", "Protect with a password")
    .option("-u, --url <url>", "Base URL of the VaporKey instance", {
        default: API_BASE_URL,
    })
    .action(async (secret, options) => {
        try {
            if (!secret) {
                const response = await prompts({
                    type: "text",
                    name: "value",
                    message: "Enter the secret to share:",
                    validate: (value) => (value.length > 0 ? true : "Secret cannot be empty"),
                });
                if (!response.value) {
                    console.log(chalk.yellow("Operation cancelled"));
                    process.exit(0);
                }
                secret = response.value;
            }

            const spinner = ora("Encrypting secret...").start();

            let key: CryptoKey;
            let passwordSalt: string | undefined;

            // Mode B: Password Protected
            if (options.password) {
                const salt = generateSalt();
                key = await deriveKeyFromPassword(options.password, salt);
                passwordSalt = bufferToString(salt);
            } else {
                // Mode A: Random Key
                key = await generateKey();
            }

            const encryptedData = await encryptData(secret, key);
            const payload = options.password
                ? `${passwordSalt}:${encryptedData}` // Append Salt for storage if password mode
                : encryptedData;

            spinner.text = "Uploading to VaporKey...";
            const id = await storeSecret(payload, options.url);

            spinner.succeed("Secret secured!");

            let shareUrl = `${options.url}/s/${id}`;
            if (!options.password) {
                const keyExported = await exportKey(key);
                shareUrl += `#${keyExported}`;
            }

            console.log("\n" + chalk.green.bold("Your secure link is ready:"));
            console.log(chalk.cyan.underline(shareUrl));
            console.log("\n" + chalk.dim("This link can be viewed once and will self-destruct."));
        } catch (error) {
            // @ts-expect-error type unknown
            console.error(chalk.red(`Error: ${error.message}`));
            process.exit(1);
        }
    });

cli
    .command("get <url>", "Retrieve a secret from a URL")
    .option("-p, --password <password>", "Password for decryption")
    .action(async (url, options) => {
        try {
            const parsedUrl = new URL(url);
            // Extract ID from path: /s/:id or just /:id
            // Path might be /s/abc or /abc
            // We need to robustly find the ID.
            const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
            const id = pathParts[pathParts.length - 1];
            const hashKey = parsedUrl.hash.replace("#", "");

            if (!id) {
                throw new Error("Invalid URL: Could not extract Secret ID");
            }

            const spinner = ora("Fetching secret...").start();
            const encryptedPayload = await retrieveSecret(id, parsedUrl.origin);

            if (!encryptedPayload) {
                spinner.fail("Secret not found or already destroyed.");
                process.exit(1);
            }

            spinner.text = "Decrypting...";

            let secret;

            if (hashKey) {
                // Mode A: Key in URL
                const key = await importKey(hashKey);
                secret = await decryptData(encryptedPayload, key);
            } else {
                // Mode B: Password Protected
                spinner.stop(); // Stop spinner to prompt
                let password = options.password;

                if (!password) {
                    const response = await prompts({
                        type: "password",
                        name: "value",
                        message: "This secret is password protected. Enter password:",
                    });
                    password = response.value;
                }

                if (!password) {
                    console.log(chalk.yellow("Password required."));
                    process.exit(1);
                }

                spinner.start("Decrypting with password...");

                // Parse payload to get Salt
                // Format: salt:iv:ciphertext
                const parts = encryptedPayload.split(":");
                if (parts.length !== 3) {
                    // Maybe it wasn't password protected but URL had no hash?
                    // Or format mismatch.
                    // Try standard decryption with blank password? No.
                    throw new Error("Encrypted data format mismatch (Expected Salt).");
                }

                const [saltStr] = parts;
                // Reconstruct salt
                // saltStr is Base64
                const saltBuffer = new Uint8Array(
                    globalThis.atob(saltStr.replace(/-/g, "+").replace(/_/g, "/"))
                        .split("").map(c => c.charCodeAt(0))
                );

                const key = await deriveKeyFromPassword(password, saltBuffer);

                // Pass the whole payload to decryptData which expects salt:iv:ciphertext or iv:ciphertext.
                // Our decryptData handles both.
                try {
                    secret = await decryptData(encryptedPayload, key);
                } catch (e) {
                    throw new Error("Incorrect password or data corruption.");
                }
            }

            spinner.succeed("Decrypted:");
            console.log("\n" + chalk.white.bold(secret));
        } catch (error) {
            // @ts-expect-error type unknown
            console.error(chalk.red(`Error: ${error.message}`));
            process.exit(1);
        }
    });

cli.help();
cli.version("0.1.0");
cli.parse();
