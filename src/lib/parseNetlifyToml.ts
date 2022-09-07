const TOML = require("@iarna/toml");
const fs = require("fs");
export const parseNetlifyToml = () => {
  let netlifyObject: any = {};
  try {
    const fileContents = fs.readFileSync("./netlify.toml").toString();
    netlifyObject = TOML.parse(fileContents);
    console.log("JSON data is saved.");
  } catch (error) {
    console.error(error);
  }
  return netlifyObject;
};
