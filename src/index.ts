#!/usr/bin/env node

import { mapHeaders } from "./lib/mapHeaders";
import { mapRedirects } from "./lib/mapRedirects";
import { parseNetlifyToml } from "./lib/parseNetlifyToml";
import { writeVercelJson } from "./lib/writeVercelJson";
import { Command } from "commander";

const program = new Command();

program
  .option(
    "-n, --netlify_path <netlifyTomlPath>",
    "Path to read the netlify.toml file",
    "./netlify.toml"
  )
  .option(
    "-v, --vercel_path <vercelJsonPath>",
    "Path to write the vercel.json file",
    "./vercel.json"
  )
  .parse();

const { netlify_path, vercel_path } = program.opts();

let netlifyObject = parseNetlifyToml(netlify_path);

const redirects = mapRedirects(
  netlifyObject.redirects.filter((redirect) => redirect.status !== 200)
);

const rewrites = mapRedirects(
  netlifyObject.redirects.filter((redirect) => redirect.status === 200)
);

const headers = mapHeaders(netlifyObject?.headers);

writeVercelJson(
  {
    redirects,
    rewrites,
    headers,
    ...(netlifyObject?.build?.publish && {
      outputDirectory: netlifyObject?.build?.publish,
    }),
    ...(netlifyObject?.build?.ignore && {
      ignoreCommand: netlifyObject?.build?.ignore,
    }),
    ...(netlifyObject?.build?.command && {
      buildCommand: netlifyObject?.build?.command,
    }),
  },
  vercel_path
);
