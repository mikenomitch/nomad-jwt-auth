// @ts-check
import * as core from '@actions/core';
import fetch from 'node-fetch';
import got from 'got';

async function main() {
  let nomadUrl = core.getInput('url', { required: false });
  let url = nomadUrl + "/v1/acl/login"

  let methodName = core.getInput('methodName', { required: false });
  let idToken = core.getInput('identityToken', { required: false });
  if (!idToken) {
    let githubAudience = core.getInput('jwtGithubAudience', { required: false });
    idToken = await core.getIDToken(githubAudience);
  }

  let payload = {
    AuthMethodName: methodName,
    LoginToken: idToken,
  };

  core.debug(`Retrieving Nomad Token from: ${url}`);
  core.debug(`Using auth method: ${methodName}`);

  let res;
  let data;

  try {
    // res = await fetch(url, {
    //   method: 'PUT',
    //   body: JSON.stringify(payload),
    // });
    // data = await res.json();

    res = await got.put(url, {
      json: payload
    }).json();
    data = res.data;

  } catch (err) {
    core.debug("Error making Put to Nomad");
    core.debug(err);
    throw err;
  }

  console.log("res:", res);
  console.log("data:", data)

  if (data && data.SecretID) {
    core.debug('✔ Nomad Token successfully retrieved');

    core.startGroup('Token Info');
    core.debug(`Name: ${data.Name}`);
    core.debug(`AccessorID: ${data.AccessorID}`);
    core.debug(`Type: ${data.Type}`);
    core.debug(`Policies: ${JSON.stringify(data.Policies)}`);
    core.debug(`Roles: ${JSON.stringify(data.Roles)}`);
    core.endGroup();

    core.setOutput('nomadToken', data.SecretID);
    core.setOutput('nomadUrl', url);

    return "done"
  } else {
    throw Error(`Unable to retrieve token from Nomad at url ${url}.`);
  }
}

main();