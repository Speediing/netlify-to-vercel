const fs = require("fs");
export const writeVercelJson = (vercelJson, pathUrl: string) => {
  try {
    fs.writeFileSync(pathUrl, JSON.stringify(vercelJson));
    console.log("▲ vercel.json data is saved. ▲");
  } catch (error) {
    console.error(error);
  }
};
