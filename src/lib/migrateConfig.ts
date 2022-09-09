import { mapHeaders } from "./mapHeaders";
import { mapRedirects } from "./mapRedirects";
import { parseNetlifyToml } from "./parseNetlifyToml";
import { writeVercelJson } from "./writeVercelJson";

export const migrateConfig = (netlify_path: string, vercel_path: string) => {
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
};
