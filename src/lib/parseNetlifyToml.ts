const TOML = require("@iarna/toml");
const fs = require("fs");
export const parseNetlifyToml = (pathUrl: string) => {
  let netlifyObject: any = {};
  try {
    const fileContents = fs.readFileSync(pathUrl).toString();
    netlifyObject = TOML.parse(fileContents);
    console.log("netlify.toml data is read");
  } catch (error) {
    throw "Wrong netlify.toml path, please pass in a correct path to the -n flag";
  }
  return netlifyObject;
};
