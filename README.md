# VaporKey Monorepo

Welcome to the VaporKey Monorepo. This repository contains the source code for the VaporKey web application and CLI tool.

## 📂 Project Structure

Verified with **Bun Workspaces**.

- **`apps/web`**: The Next.js 16 Web Application.
- **`apps/cli`**: The CLI tool for terminal usage.
- **`packages/core`**: Shared TypeScript library containing crypto logic and types.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)

### Installation

**Method 1: CLI (Global)**
```bash
npm install -g vaporkey-cli
```

**Method 2: Monorepo (Source)**
Install dependencies for the entire workspace:

```bash
bun install
```

### Development

To run the entire stack (or specific parts):

```bash
# Run everything
bun dev

# Run only Web App
cd apps/web
bun dev

# Run CLI (Development Mode)
bun apps/cli/src/index.ts share "Secret"
```

## 🛠️ CLI Usage

The CLI behaves just like the web app but in your terminal.

```bash
# Share a secret
bun apps/cli/src/index.ts share "My Secret"

# Retrieve a secret
bun apps/cli/src/index.ts get <URL>
```

## 📦 Deployment

- **Web**: Deployed to Vercel (Root Directory: `apps/web`).
- **CLI**: Published to npm ([vaporkey-cli](https://www.npmjs.com/package/vaporkey-cli)).

---
**VaporKey** - Secure, Ephemeral, Zero-Knowledge Credential Sharing.
