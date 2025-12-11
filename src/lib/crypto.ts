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
  const [ivStr, encryptedStr] = encryptedCombo.split(":");

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
