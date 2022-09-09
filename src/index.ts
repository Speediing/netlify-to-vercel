#!/usr/bin/env node

import { Command } from "commander";
import { updateEnvironmentVariable } from "./lib/updateEnvironmentVariables";
import { migrateConfig } from "./lib/migrateConfig";
const inquirer = require("inquirer");
const program = new Command();

const main = async () => {
  program
    .option(
      "-np, --netlify_path <netlifyTomlPath>",
      "Path to read the netlify.toml file",
      "./netlify.toml"
    )
    .option(
      "-vp, --vercel_path <vercelJsonPath>",
      "Path to write the vercel.json file",
      "./vercel.json"
    )
    .option(
      "-nt, --netlify_token <netlifyToken>",
      "Netlify Auth token to update environment variables"
    )
    .option(
      "-vt, --vercel_token <vercelToken>",
      "Vercel Auth token to update environment variables"
    )
    .parse();

  const { netlify_path, vercel_path, netlify_token, vercel_token } =
    program.opts();

  const environmentQuestion = [
    {
      type: "list",
      loop: false,
      name: "environmentQuestion",
      message: "Would you like to migrate environment variables?",
      choices: ["yes", "no"],
    },
  ];
  let environmentQuestionAnswer = await inquirer.prompt(environmentQuestion);

  if (environmentQuestionAnswer.environmentQuestion === "yes") {
    if (!netlify_token) {
      throw "Please add a -nt flag for your netlify token";
    }
    if (!vercel_token) {
      throw "Please add a -vt flag for your vercel token";
    }
    await updateEnvironmentVariable(netlify_token, vercel_token);
  }
  const configQuestion = [
    {
      type: "list",
      loop: false,
      name: "configQuestion",
      message: "Would you like to migrate your netlify.toml to a vercel.json?",
      choices: ["yes", "no"],
    },
  ];
  let configQuestionAnswer = await inquirer.prompt(configQuestion);

  if (configQuestionAnswer.configQuestion === "yes") {
    await migrateConfig(netlify_path, vercel_path);
  }
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.log(e);
  }
})();
