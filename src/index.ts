#!/usr/bin/env node

import { mapHeaders } from "./lib/mapHeaders";
import { mapRedirects } from "./lib/mapRedirects";
import { parseNetlifyToml } from "./lib/parseNetlifyToml";
import { writeVercelJson } from "./lib/writeVercelJson";

let netlifyObject = parseNetlifyToml();

const redirects = mapRedirects(
  netlifyObject.redirects.filter((redirect) => redirect.status !== 200)
);

const rewrites = mapRedirects(
  netlifyObject.redirects.filter((redirect) => redirect.status === 200)
);

const headers = mapHeaders(netlifyObject?.headers);

writeVercelJson({
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
});
