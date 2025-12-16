# VaporKey

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![ElysiaJS](https://img.shields.io/badge/ElysiaJS-1.4-pink)
![Redis](https://img.shields.io/badge/Upstash-Redis-green)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-cyan)

<img src="/public/og-image.jpg" alt="VaporKey" width="900" />

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

VaporKey uses a **Client-Side Encryption** model with two distinct security modes:

### 1. The Encryption (Sender)

**Mode A: Standard (Random Key)**

1.  **Generation:** The browser generates a 256-bit AES-GCM key.
2.  **Encryption:** The payload is encrypted locally.
3.  **Link:** The key is appended to the URL hash fragment (`#key`). The server never sees this key.

**Mode B: Password Protected (PBKDF2)**

1.  **Derivation:** The user inputs a password. The browser generates a random **Salt** and uses **PBKDF2** (100,000 iterations) to derive a 256-bit AES key.
2.  **Encryption:** The payload is encrypted with this derived key.
3.  **Storage:** The `Salt` is stored alongside the encrypted data in Redis.
4.  **Link:** The URL is generated **without a key**. The recipient _must_ know the password to derive the key and unlock the data.

### 2. The Retrieval (Recipient)

1.  **Access:** The recipient opens the link.
2.  **Atomic Destruction:** The backend performs a `GETDEL` (Get and Delete) operation on Redis.
    - If the secret exists, it is returned and immediately wiped from memory.
    - If a second person tries to view it, the database is already empty.
3.  **Decryption:**
    - **Standard:** The browser takes the key from the URL hash and decrypts the data.
    - **Password:** The browser prompts the user for the password, combines it with the stored Salt, re-derives the key, and attempts decryption.

---

## ✨ Features

- **Zero-Knowledge Privacy:** The server cannot read your secrets.
- **Single-View Access:** Secrets are destroyed immediately after being fetched once.
- **Password Protection:** Optional secondary password using PBKDF2/SHA-256 for key derivation.
- **Auto-Expiration:** Secrets have a hard TTL (24 hours) if not viewed.
- **Internationalization:** Full support for 9 languages (English, Greek, Spanish, French, German, Chinese, Japanese, Portuguese, Arabic) with RTL support.
- **Syntax Highlighting:** Automatic highlighting for JSON, TypeScript, Python, SQL, and more via `Shiki`.
- **Bot Protection:** Integrated Cloudflare Turnstile CAPTCHA.
- **QR Code Sharing:** Generate, download, and share QR codes with native Web Share API support for seamless mobile sharing.
- **Modern UI:** Glassmorphism design, "Matrix" reveal effects, and dark/light mode support.

## ⚡ Tech Stack

This project leverages a bleeding-edge stack focusing on performance and type safety.

| Category         | Technology          | Description                                          |
| :--------------- | :------------------ | :--------------------------------------------------- |
| **Framework**    | **Next.js 16**      | App Router, React 19 (RC), Server Actions.           |
| **API**          | **ElysiaJS**        | Running as a Next.js API route via `@elysiajs/eden`. |
| **Database**     | **Upstash Redis**   | Serverless Redis for ephemeral key-value storage.    |
| **Styling**      | **Tailwind CSS v4** | Next-gen utility CSS engine.                         |
| **Cryptography** | **Web Crypto API**  | Native AES-GCM & PBKDF2 (SHA-256) implementation.    |
| **i18n**         | **next-intl**       | Type-safe internationalization with 9 languages.     |
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
│   ├── [locale]/              # Internationalized routes
│   │   ├── layout.tsx         # Locale-aware layout
│   │   ├── page.tsx           # Homepage
│   │   └── s/[secretId]/      # The secret reveal page
│   ├── api/[[...slugs]]/      # ElysiaJS API entry point
│   └── globals.css            # Tailwind v4 & Theme config
├── components/                # Shared UI components
│   └── language-selector.tsx  # Language switcher
├── features/
│   ├── main/                  # Homepage (Input/Encryption logic)
│   │   └── components/
│   │       ├── input-card.tsx        # Secret input form
│   │       ├── result-card.tsx       # Link display card
│   │       ├── qr-code-section.tsx   # QR code generation & sharing
│   │       └── ...
│   └── secret/                # Reveal page (Decryption/Display logic)
├── i18n/
│   ├── request.ts             # Server-side i18n configuration
│   └── routing.ts             # i18n routing configuration
├── lib/
│   ├── client.ts              # Elysia Eden (Type-safe API client)
│   ├── crypto.ts              # AES-GCM & PBKDF2 implementation
│   └── redis.ts               # Database connection
├── providers/                 # React Context providers (Theme, Query)
└── middleware.ts              # i18n middleware for locale routing

messages/
├── en.json                    # English translations
├── el.json                    # Greek translations
├── es.json                    # Spanish translations
├── fr.json                    # French translations
├── de.json                    # German translations
├── zh.json                    # Chinese translations
├── ja.json                    # Japanese translations
├── pt.json                    # Portuguese translations
└── ar.json                    # Arabic translations
```

## 🌍 Supported Languages

VaporKey is available in 9 languages with full translations:

- 🇬🇧 **English** (en)
- 🇬🇷 **Greek** (el) - Ελληνικά
- 🇪🇸 **Spanish** (es) - Español
- 🇫🇷 **French** (fr) - Français
- 🇩🇪 **German** (de) - Deutsch
- 🇨🇳 **Chinese** (zh) - 中文
- 🇯🇵 **Japanese** (ja) - 日本語
- 🇵🇹 **Portuguese** (pt) - Português
- 🇸🇦 **Arabic** (ar) - العربية (RTL Support)
