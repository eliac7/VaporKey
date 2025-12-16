# VaporKey CLI

A secure, terminal-based tool for sharing self-destructing secrets using VaporKey.

## 📦 Installation

Install globally via **NPM**:

```bash
npm install -g vaporkey-cli
```

## 🚀 Usage

The CLI supports two main commands: `share` and `get`.

### **Share a Secret**

Encrypts a secret locally and uploads it to VaporKey.

```bash
# Interactive mode (prompts for secret)
vaporkey share

# Direct mode
vaporkey share "My Top Secret Data"

# Password Protected (Mode B)
vaporkey share "My Secret" --password "super-secure-password"
```

**Options:**
- `-p, --password <string>`: Encrypt with a password (recipient needs it to decrypt).
- `-u, --url <string>`: Specify a custom VaporKey instance (default: `https://vaporkey.vercel.app`).

### **Retrieve a Secret**

Fetches and decrypts a secret from a VaporKey URL.

```bash
# Standard retrieval (Key in URL)
vaporkey get "https://vaporkey.vercel.app/s/abc12345#key_..."

# Password Protected
vaporkey get "https://vaporkey.vercel.app/s/abc12345"
# (You will be prompted for the password)
```

**Options:**
- `-p, --password <string>`: Provide password upfront.

## ⚙️ Configuration

You can set the default API URL using an environment variable:

```bash
export VAPORKEY_API_URL="http://localhost:3000"
```

## 🛠️ Development

To run locally from source:

```bash
bun install
bun apps/cli/src/index.ts --help
```
