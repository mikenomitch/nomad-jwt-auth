// @ts-check
import * as core from '@actions/core';
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

  let client = httpClient();

  let payload = {
    AuthMethodName: methodName,
    LoginToken: idToken,
  };

  core.debug(`Retrieving Nomad Token from: ${url}`);
  core.debug(`Using auth method: ${methodName}`);

  let data;

  try {
    data = await client.put(url, {
      json: payload
    }).json();

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

    core.setOutput('nomadUrl', url);
    // TODO: Wrap in conditional
    core.setOutput('nomadToken', data.SecretID);

    // TODO: Export token as env var if input is set

    return "done"
  } else {
    throw Error(`Unable to retrieve token from Nomad at url ${url}.`);
  }
}

function httpClient() {
  let defaultOptions = {
    headers: {},
    https: {},
  };

  let tlsSkipVerify = (core.getInput('tlsSkipVerify', { required: false }) || 'false').toLowerCase() != 'false';
  if (tlsSkipVerify === true) {
    defaultOptions.https.rejectUnauthorized = false;
  }

  let caCertificateRaw = core.getInput('caCertificate', { required: false });
  if (caCertificateRaw != null) {
    defaultOptions.https.certificateAuthority = Buffer.from(caCertificateRaw, 'base64').toString();
  }

  let clientCertificateRaw = core.getInput('clientCertificate', { required: false });
  if (clientCertificateRaw != null) {
    defaultOptions.https.certificate = Buffer.from(clientCertificateRaw, 'base64').toString();
  }

  let clientKeyRaw = core.getInput('clientKey', { required: false });
  if (clientKeyRaw != null) {
    defaultOptions.https.key = Buffer.from(clientKeyRaw, 'base64').toString();
  }

  let extraHeaders = parseHeadersInput('extraHeaders', { required: false });
  for (let [headerName, headerValue] of extraHeaders) {
    defaultOptions.headers[headerName] = headerValue;
  }

  return got.extend(defaultOptions);
}

function parseHeadersInput(inputKey, inputOptions) {
  /** @type {string}*/
  const rawHeadersString = core.getInput(inputKey, inputOptions) || '';
  const headerStrings = rawHeadersString
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');
  return headerStrings
    .reduce((map, line) => {
      const seperator = line.indexOf(':');
      const key = line.substring(0, seperator).trim().toLowerCase();
      const value = line.substring(seperator + 1).trim();
      if (map.has(key)) {
        map.set(key, [map.get(key), value].join(', '));
      } else {
        map.set(key, value);
      }
      return map;
    }, new Map());
}

main();