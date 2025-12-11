#!/usr/bin/env node
import { Client } from "./client";
import { AuthenticationError, FastFoldError } from "./errors";

function printErr(msg: string) {
  process.stderr.write(msg + "\n");
}

function parseJsonOpt(value: string | undefined, label: string): Record<string, unknown> | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    throw new Error(`${label} must be a JSON object`);
  } catch (e: any) {
    throw new Error(`Invalid JSON for ${label}: ${e?.message || String(e)}`);
  }
}

function showHelpAndExit(code = 1) {
  const help = [
    "Usage:",
    "  fastfold fold --sequence <SEQ> --model <MODEL> [--name <NAME>] [--from-id <UUID>]",
    "                 [--params '{...}'] [--constraints '{...}']",
    "                 [--api-key <KEY>] [--base-url <URL>] [--timeout <ms>]",
    "",
    "Environment:",
    "  FASTFOLD_API_KEY   API key if --api-key not provided",
    "  FASTFOLD_BASE_URL  Override base URL (default https://api.fastfold.ai)",
    ""
  ].join("\n");
  console.log(help);
  process.exit(code);
}

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  if (!cmd) showHelpAndExit(1);
  if (cmd !== "fold") showHelpAndExit(1);

  const opts: Record<string, string> = {};
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    opts[key] = val;
  }

  const sequence = opts["sequence"];
  const model = opts["model"];
  if (!sequence || !model) {
    printErr("Error: --sequence and --model are required.");
    showHelpAndExit(2);
    return;
  }

  const apiKey = opts["api-key"] || process.env.FASTFOLD_API_KEY;
  const baseUrl = opts["base-url"] || process.env.FASTFOLD_BASE_URL || "https://api.fastfold.ai";
  const timeout = opts["timeout"] ? Number(opts["timeout"]) : undefined;

  try {
    const client = new Client({ apiKey, baseUrl, timeoutMs: timeout });
    const job = await client.fold.create({
      sequence,
      model,
      name: opts["name"],
      fromId: opts["from-id"],
      params: parseJsonOpt(opts["params"], "params"),
      constraints: parseJsonOpt(opts["constraints"], "constraints")
    });
    console.log(job.id);
    process.exit(0);
  } catch (e: any) {
    if (e instanceof AuthenticationError) {
      printErr(`Authentication failed: ${e.message}`);
      process.exit(2);
    } else if (e instanceof FastFoldError) {
      printErr(`Request failed: ${e.message}`);
      process.exit(1);
    } else {
      printErr(`Unexpected error: ${e?.message || String(e)}`);
      process.exit(1);
    }
  }
}

main();


