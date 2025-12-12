const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  let padded = base64.replace(/-/g, "+").replace(/_/g, "/");
  while (padded.length % 4) {
    padded += "=";
  }

  const binaryString = window.atob(padded);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export async function generateKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt).buffer as ArrayBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(exported);
}

export async function importKey(keyStr: string): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(keyStr);
  return window.crypto.subtle.importKey("raw", keyBuffer, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptData(
  data: string,
  key: CryptoKey
): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  const ivStr = arrayBufferToBase64(iv.buffer);
  const encryptedStr = arrayBufferToBase64(encrypted);

  return `${ivStr}:${encryptedStr}`;
}

export async function decryptData(
  encryptedCombo: string,
  key: CryptoKey
): Promise<string> {
  // Check if we have salt:iv:data or just iv:data
  const parts = encryptedCombo.split(":");

  let ivStr, encryptedStr;

  if (parts.length === 3) {
    // Format: salt:iv:ciphertext
    [, ivStr, encryptedStr] = parts;
  } else {
    // Format: iv:ciphertext
    [ivStr, encryptedStr] = parts;
  }

  if (!ivStr || !encryptedStr) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = base64ToArrayBuffer(ivStr);
  const encrypted = base64ToArrayBuffer(encryptedStr);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}

export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

export function bufferToString(buffer: Uint8Array): string {
  return arrayBufferToBase64(buffer.buffer as ArrayBuffer);
}

export function stringToBuffer(str: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(str));
}
