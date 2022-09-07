const fs = require("fs");
export const writeVercelJson = (vercelJson) => {
  try {
    fs.writeFileSync("vercel.json", JSON.stringify(vercelJson));
    console.log("TOML data is read.");
  } catch (error) {
    console.error(error);
  }
};
