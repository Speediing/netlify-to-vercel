#!/usr/bin/env node

import { mapHeaders } from "./lib/mapHeaders";
import { mapRedirect } from "./lib/mapRedirect";
import { parseNetlifyToml } from "./lib/parseNetlifyToml";
import { writeVercelJson } from "./lib/writeVercelJson";

let netlifyObject = parseNetlifyToml();

const redirects = mapRedirect(
  netlifyObject.redirects.filter((redirect) => redirect.status !== 200)
);

const rewrites = mapRedirect(
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
