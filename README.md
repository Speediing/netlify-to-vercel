# Netlify to Vercel Configuration Migrator

This is a tool that allows you to quickly migrate your `netlify.toml` file into a `vercel.json`. No need to copy over redirects by hand!

## Instructions

You can optionally enter settings for netlify-to-vercel (or enter --help to show during runtime):

- `--netlify_path` : The path to the `netlify.toml` file to read (default: `./netlify.toml`)
- `--vercel_path` : The path to the `vercel.json` file to write (default: `./vercel.json`)
- `--netlify_token` : The auth token for accessing your Netlify environment variables. Generation instructions can be found [here](https://docs.netlify.com/cli/get-started/#obtain-a-token-in-the-netlify-ui) 
- `--vercel_token` :  The auth token for accessing your Vercel environment variables. Generation instructions can be found [here](https://vercel.com/guides/how-do-i-use-a-vercel-api-access-token)

Run the following (with optional flags):

```bash
npx netlify-to-vercel
```

You will first choose if you want to migrate your environment variables, and then you will pick the Netlify project to pull from. Finally, you will select the Vercel project you would like to save the variables to.

```bash
? Would you like to migrate environment variables? yes
? Which Netlify Team do you want env vars from? test
? Which Netlify Project do you want env vars from? helpful-cranachan-3774bc - https://github.com/Speediing/simon-game
? Which Vercel Team is your project in? jasonwikerpro
? Which Vercel Project do you want to save the variables at? nextjs-boilerplate
▲ Variables Updated
```

You will now be asked if you would like to migrate your `netlify.toml` file

```bash
? Would you like to migrate your netlify.toml to a vercel.json? yes
netlify.toml data is read
▲ vercel.json data is saved. ▲
```

If you have a `netlify.toml` file that looks like:

```toml
[Settings]
ID = "Your_Site_ID"

[build]
  base    = "project/"
  publish = "project/build-output/"
  command = "echo 'default context'"
  ignore = "git diff --quiet HEAD^ HEAD sub_dir/"

[[redirects]]
  from = "/*"
  to = "/blog/:splat"

[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
  query = {path = ":path"} 

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
[[redirects]]
  from = "/api/*"
  to = "https://us-central1-netlify-intercom.cloudfunctions.net/readHeaders/:splat"
  status = 200


[[headers]]
  for = "/*" 
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "frame-ancestors https://www.facebook.com"
    Basic-Auth = "someuser:somepassword anotheruser:anotherpassword"
```

Your resulting `vercel.json` will look like:

```json
{
  "redirects": [
    { "source": "/(.*)", "destination": "/blog/:splat", "permanent": true },
    {
      "source": "/old-path",
      "destination": "/new-path",
      "has": [{ "type": "query", "key": "path" }],
      "permanent": true
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" },
    {
      "source": "/api/(.*)",
      "destination": "https://us-central1-netlify-intercom.cloudfunctions.net/readHeaders/:splat"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors https://www.facebook.com"
        },
        {
          "key": "Basic-Auth",
          "value": "someuser:somepassword anotheruser:anotherpassword"
        }
      ]
    }
  ],
  "outputDirectory": "project/build-output/",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD sub_dir/",
  "buildCommand": "echo 'default context'"
}
```
