
export const API_BASE_URL = process.env.VAPORKEY_API_URL || "https://vaporkey.vercel.app";

export async function storeSecret(encryptedData: string, baseUrl: string = API_BASE_URL) {
    const response = await fetch(`${baseUrl}/api/secret/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedData }),
    });

    if (!response.ok) {
        throw new Error(`Failed to store secret: ${response.statusText}`);
    }

    const data = (await response.json()) as { id: string };
    return data.id;
}

export async function retrieveSecret(id: string, baseUrl: string = API_BASE_URL) {
    const response = await fetch(`${baseUrl}/api/secret/retrieve?id=${id}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Failed to retrieve secret: ${response.statusText}`);
    }

    const data = (await response.json()) as { encryptedData: string };
    return data.encryptedData;
}
