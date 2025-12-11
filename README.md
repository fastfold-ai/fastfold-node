# Fastfold AI Typescript SDK

JavaScript/TypeScript SDK and CLI for the Fastfold API.

## Quick Start

Get started with the Fastfold API and start folding protein sequences in seconds.

The Fastfold platform provides a simple, production-ready API to fold protein sequences, compute structural properties, run complex workflows, and orchestrate agents. Leverage specialized models, agents, and workflows for protein design and multimodal predictions.

### 1) Create an API key

Before you can use the API, you need to create an API key in the Fastfold cloud dashboard. Once created, use it to authenticate requests. Keep your key secret (do not commit it), and store it in your environment variables.

macOS / Linux:

```bash
export FASTFOLD_API_KEY="your_api_key_here"
```

Windows (PowerShell):

```powershell
$env:FASTFOLD_API_KEY="your_api_key_here"
```

The SDK will automatically pick up the API key from the `FASTFOLD_API_KEY` environment variable. You can also pass it explicitly via `new Client({ apiKey })`.

### 2) Install the Fastfold AI SDK (JavaScript/TypeScript)

```bash
npm install fastfold-ai
```

Node.js 18+ is required (uses global `fetch`).

### 3) Fold a protein sequence (JavaScript/TypeScript)

Create a file named `example.ts` and run:

```ts
import { Client } from 'fastfold-ai';

const client = new Client(); // reads FASTFOLD_API_KEY from env

const response = await client.fold.create({
  sequence: 'LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES',
  model: 'boltz-2',
});

console.log(response.id);
```

Run it with TS runner:

- macOS / Linux:

```bash
FASTFOLD_API_KEY="your_api_key_here" npx tsx example.ts
```

- Windows (PowerShell):

```powershell
$env:FASTFOLD_API_KEY="your_api_key_here"; npx tsx example.ts
```

CommonJS users (Node CJS) can wrap in an async IIFE and use ts-node:

```ts
import { Client } from 'fastfold-ai';

(async () => {
  const client = new Client();
  const response = await client.fold.create({
    sequence: 'LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES',
    model: 'boltz-2',
  });
  console.log(response.id);
})();
```

- macOS / Linux:

```bash
FASTFOLD_API_KEY="your_api_key_here" npx ts-node example.ts
```

- Windows (PowerShell):

```powershell
$env:FASTFOLD_API_KEY="your_api_key_here"; npx ts-node example.ts
```

## Next steps

- Explore all endpoints in the API Reference: [API Reference](https://docs.fastfold.ai/docs/api)
- Browse available models and capabilities: [Models](https://cloud.fastfold.ai/models)

You’re ready to fold your own sequences and integrate Fastfold into your pipelines. Happy building!

---

## CLI (optional)

You can also submit jobs via the CLI:

```bash
npx fastfold fold --sequence "LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES" --model boltz-2
```

Optional flags:

```bash
fastfold fold \
  --sequence "..." \
  --model boltz-2 \
  --name "My Job" \
  --api-key "sk-..." \
  --base-url "https://api.fastfold.ai"
```

---

## Requirements

- Node.js 18+

CLI prints the created job ID to stdout on success.


