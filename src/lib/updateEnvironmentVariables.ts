const inquirer = require("inquirer");
const axios = require("axios");

export const updateEnvironmentVariable = async (
  netlify_token: string,
  vercel_token: string
) => {
  let netlifyacc = await axios.get("https://api.netlify.com/api/v1/accounts", {
    headers: {
      Authorization: "Bearer " + netlify_token, //the token is a variable which holds the token
    },
  });
  const questions = [
    {
      type: "list",
      loop: false,
      name: "netAccount",
      message: "Which Netlify Team do you want env vars from?",
      choices: netlifyacc.data.map((x) => x.name),
    },
  ];
  let netAccountOption = await inquirer.prompt(questions);
  const slug = netlifyacc.data.find(
    (x) => x.name === netAccountOption.netAccount
  ).slug;

  let netlifyProjects = await axios.get(
    `https://api.netlify.com/api/v1/${slug}/sites`,
    {
      headers: {
        Authorization: "Bearer " + netlify_token, //the token is a variable which holds the token
      },
    }
  );
  const questions2 = [
    {
      type: "list",
      loop: false,
      name: "netAccount2",
      message: "Which Netlify Project do you want env vars from?",
      choices: netlifyProjects.data.map(
        (x) => `${x.name} - ${x.build_settings.repo_url}`
      ),
    },
  ];
  let netProjectOption = await inquirer.prompt(questions2);

  let envs = netlifyProjects.data.find(
    (x) =>
      `${x.name} - ${x.build_settings.repo_url}` ===
      netProjectOption.netAccount2
  ).build_settings.env;
  let vercelTeams = await axios.get("https://api.vercel.com/v2/teams", {
    headers: {
      Authorization: "Bearer " + vercel_token, //the token is a variable which holds the token
    },
  });
  const questions3 = [
    {
      type: "list",
      loop: false,
      name: "verTeamOption",
      message: "Which Vercel Team is your project in?",
      choices: [...vercelTeams.data.teams.map((x) => `${x.name}`)],
    },
  ];
  let verTeamOption = await inquirer.prompt(questions3);
  let teamId = vercelTeams.data.teams.find(
    (x) => x.name === verTeamOption.verTeamOption
  ).id;
  let vercelProjects = await axios.get(
    `https://api.vercel.com/v9/projects?teamId=${teamId}`,
    {
      headers: {
        Authorization: "Bearer " + vercel_token,
      },
    }
  );
  const questions4 = [
    {
      type: "list",
      loop: false,
      name: "verProjOption",
      message: "Which Vercel Project do you want to save the variables at?",
      choices: vercelProjects.data.projects.map((x) => `${x.name}`),
    },
  ];
  let verProjOption = await inquirer.prompt(questions4);

  for (const [key, value] of Object.entries(envs)) {
    await axios.post(
      `https://api.vercel.com/v7/projects/${verProjOption.verProjOption}/env?teamId=${teamId}`,
      {
        key,
        value,
        target: ["production", "preview"],
        type: "encrypted",
      },
      {
        headers: {
          Authorization: "Bearer " + vercel_token,
        },
      }
    );
  }
  console.log("▲ Variables Updated");
};
