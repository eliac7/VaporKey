# VaporKey

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![ElysiaJS](https://img.shields.io/badge/ElysiaJS-1.4-pink)
![Redis](https://img.shields.io/badge/Upstash-Redis-green)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-cyan)

**Secure, Ephemeral, Zero-Knowledge Credential Sharing.**

<p align="center">
  <a href="#-security-architecture">Security Architecture</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

</div>

---

## 📖 Overview

**VaporKey** is a modern utility for sharing sensitive data (API keys, passwords, environment variables) securely. It solves the problem of sending secrets over permanent channels like Slack, Email, or Discord.

Unlike standard pastebins, VaporKey creates **self-destructing, single-view links**. The core philosophy is **Zero-Knowledge**: the encryption happens entirely in your browser. The server only ever sees encrypted binary data and never receives the decryption key.

## 🛡️ Security Architecture

VaporKey uses a **Client-Side Encryption** model. Here is the analytical breakdown of the data flow:

### 1. The Encryption (Sender)

1.  **Generation:** When you click "Encrypt", the browser generates a 256-bit AES-GCM key via the Web Crypto API (`window.crypto.subtle`).
2.  **Encryption:** The payload (secret + language metadata) is encrypted locally using this key.
3.  **Storage:** The _encrypted_ data is sent to the backend (ElysiaJS/Next.js) and stored in Redis with a TTL (Time-To-Live).
4.  **Link Creation:** The server returns a unique ID. The browser constructs the final URL:
    ```
    [https://example.com/s/](https://example.com/s/)[id]#[decryption_key]
    ```
    > **Crucial:** The decryption key is appended as a **URL Hash Fragment** (`#...`). Hash fragments are **never sent to the server** in HTTP requests. They exist only on the client side.

### 2. The Retrieval (Recipient)

1.  **Access:** The recipient opens the link. The browser parses the ID from the path and the key from the hash.
2.  **Fetch:** The client requests the data from the API using the ID.
3.  **Atomic Destruction:** The backend performs a `GETDEL` (Get and Delete) operation on Redis.
    - If the secret exists, it is returned and immediately wiped from memory.
    - If a second person tries to view it, the database is already empty.
4.  **Decryption:** The browser uses the key from the URL hash to decrypt the data locally and render it.

---

## ✨ Features

- **Zero-Knowledge Privacy:** The server cannot read your secrets.
- **Single-View Access:** Secrets are destroyed immediately after being fetched once.
- **Auto-Expiration:** Secrets have a hard TTL (24 hours) if not viewed.
- **Syntax Highlighting:** Automatic highlighting for JSON, TypeScript, Python, SQL, and more via `Shiki`.
- **Bot Protection:** Integrated Cloudflare Turnstile CAPTCHA.
- **QR Code Generation:** Instantly generate QR codes for mobile sharing.
- **Modern UI:** Glassmorphism design, "Matrix" reveal effects, and dark/light mode support.

## ⚡ Tech Stack

This project leverages a bleeding-edge stack focusing on performance and type safety.

| Category         | Technology          | Description                                          |
| :--------------- | :------------------ | :--------------------------------------------------- |
| **Framework**    | **Next.js 16**      | App Router, React 19 (RC), Server Actions.           |
| **API**          | **ElysiaJS**        | Running as a Next.js API route via `@elysiajs/eden`. |
| **Database**     | **Upstash Redis**   | Serverless Redis for ephemeral key-value storage.    |
| **Styling**      | **Tailwind CSS v4** | Next-gen utility CSS engine.                         |
| **Cryptography** | **Web Crypto API**  | Native browser standard for AES-GCM encryption.      |
| **Validation**   | **Zod**             | Runtime schema validation.                           |
| **Icons**        | **Lucide React**    | Consistent and lightweight icon set.                 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.x
- An Upstash Redis database (Serverless)
- Cloudflare Turnstile Site/Secret keys

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/eliac7/vaporkey.git](https://github.com/eliac7/vaporkey.git)
    cd vaporkey
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Configure Environment Variables:**
    Rename `.env.example` to `.env.local` and fill in the values:

    ```env
    NEXT_PUBLIC_BASE_URL="http://localhost:3000"

    # Upstash Redis Connection
    UPSTASH_REDIS_REST_URL="[https://your-db.upstash.io](https://your-db.upstash.io)"
    UPSTASH_REDIS_REST_TOKEN="your-token"

    # Cloudflare Turnstile (Captcha)
    NEXT_PUBLIC_TURNSTILE_SITE_KEY="your-site-key"
    CLOUDFLARE_SECRET_KEY="your-secret-key"
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

```bash
src/
├── app/
│   ├── (routes)/s/[secretId]/ # The secret reveal page
│   ├── api/[[...slugs]]/      # ElysiaJS API entry point
│   └── globals.css            # Tailwind v4 & Theme config
├── components/                # Shared UI components
├── features/
│   ├── main/                  # Homepage (Input/Encryption logic)
│   └── secret/                # Reveal page (Decryption/Display logic)
├── lib/
│   ├── client.ts              # Elysia Eden (Type-safe API client)
│   ├── crypto.ts              # AES-GCM implementation
│   └── redis.ts               # Database connection
└── providers/                 # React Context providers (Theme, Query)
```
