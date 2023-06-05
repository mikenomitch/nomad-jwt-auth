// @ts-check
import * as core from '@actions/core';
import * as rsasign from "jsrsasign";
import * as fs from "fs";
import fetch, { Headers } from 'node-fetch';


async function main() {
  core.info("info test")
  let nomadUrl = core.getInput('url', { required: false }) || "http://localhost:4646";
  let url = nomadUrl + "/v1/acl/login"
  let method_name = core.getInput('method_name', { required: false }) || "github";
  let token_example = "EMPTY";
  const githubAudience = core.getInput('jwtGithubAudience', { required: false });
  let idToken = await core.getIDToken(githubAudience);
  console.log("idToken", idToken);
  let github_identity_token = idToken || token_example;

  // TODO: THIS SHOULD WORK?
  console.log("github_identity_token", github_identity_token)

  let payload = {
    AuthMethodName: method_name,
    LoginToken: github_identity_token,
  };

  core.debug(`Retrieving Nomad Token from ${url}`);

  let res;
  let data;

  try {
    res = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    console.log("res: ", res.body);
    data = await res.json();

  } catch (err) {
    core.debug("Error making Put to Nomad");
    throw err;
  }

  console.log("data", data)

  core.info("post fetch info")

  // TODO: GET THE CORRECT PATH!
  if (data && res.body && res.body.auth && res.body.auth.client_token) {
    // core.debug('✔ Nomad Token successfully retrieved');
    // core.startGroup('Token Info');
    // core.debug(`Operating under policies: ${JSON.stringify(res.body.auth.policies)}`);
    // core.debug(`Token Metadata: ${JSON.stringify(res.body.auth.metadata)}`);
    // core.endGroup();

    return "foo"
    // return res.json();
  } else {
    console.log("response", response.body);
    throw Error(`Unable to retrieve token from Nomad at url ${url}.`);
  }
}

core.info("pre main");

main().then((res) => {
  console.log("res: ", res);
}).catch((err) => {
  console.log("ERROR");
  console.log(err);
  throw err;
});
core.info("post main");
