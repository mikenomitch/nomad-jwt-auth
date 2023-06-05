// @ts-check
import * as core from '@actions/core';
// import * as rsasign from "jsrsasign";
// import * as fs from "fs";
import fetch, { Headers } from 'node-fetch';


async function main() {
  core.info("info test")
  let nomadUrl = core.getInput('url', { required: false }) || "http://localhost:4646";
  let url = nomadUrl + "/v1/acl/login"

  let method_name = core.getInput('method_name', { required: false }) || "github";
  const githubAudience = core.getInput('jwtGithubAudience', { required: false });
  let idToken = await core.getIDToken(githubAudience);
  let github_identity_token = idToken;

  let payload = {
    AuthMethodName: method_name,
    LoginToken: github_identity_token,
  };

  core.debug(`Retrieving Nomad Token from: ${url}`);
  core.debug(`Using auth method: ${method_name}`);

  let res;
  let data;

  try {
    res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    data = await res.json();

  } catch (err) {
    core.debug("Error making Put to Nomad");
    core.debug(err);
    throw err;
  }

  if (data && data.SecretID) {
    core.debug('✔ Nomad Token successfully retrieved');

    core.startGroup('Token Info');
    core.debug(`Name: ${data.Name}`);
    core.debug(`AccessorID: ${data.AccessorID}`);
    core.debug(`Type: ${data.Type}`);
    core.debug(`Policies: ${JSON.stringify(data.Policies)}`);
    core.debug(`Roles: ${JSON.stringify(data.Roles)}`);
    core.endGroup();

    core.setOutput('nomad_token', data.SecretID);

    return "done"
  } else {
    throw Error(`Unable to retrieve token from Nomad at url ${url}.`);
  }
}

main();