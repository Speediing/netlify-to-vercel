const fs = require("fs");
export const writeVercelJson = (vercelJson, pathUrl: string) => {
  try {
    fs.writeFileSync(pathUrl, JSON.stringify(vercelJson));
    console.log("▲ vercel.json data is saved. ▲");
  } catch (error) {
    throw "Wrong vercel.json path, please pass in a correct path to the -v flag";
  }
};
