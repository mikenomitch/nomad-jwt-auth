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
  // let token_example = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImVCWl9jbjNzWFlBZDBjaDRUSEJLSElnT3dPRSJ9.eyJuYW1laWQiOiJkZGRkZGRkZC1kZGRkLWRkZGQtZGRkZC1kZGRkZGRkZGRkZGQiLCJzY3AiOiJBY3Rpb25zLkdlbmVyaWNSZWFkOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCBBY3Rpb25zLlVwbG9hZEFydGlmYWN0czowMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAvMTpCdWlsZC9CdWlsZC8yMyBMb2NhdGlvblNlcnZpY2UuQ29ubmVjdCBSZWFkQW5kVXBkYXRlQnVpbGRCeVVyaTowMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAvMTpCdWlsZC9CdWlsZC8yMyIsIklkZW50aXR5VHlwZUNsYWltIjoiU3lzdGVtOlNlcnZpY2VJZGVudGl0eSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3NpZCI6IkRERERERERELUREREQtRERERC1ERERELURERERERERERERERCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcHJpbWFyeXNpZCI6ImRkZGRkZGRkLWRkZGQtZGRkZC1kZGRkLWRkZGRkZGRkZGRkZCIsImF1aSI6Ijk0MzAyYmIyLTYzOTktNGRiYi05ZmYxLTJlMzg0OThhMjgwYyIsInNpZCI6IjA2OGZmMTU0LWUzNzctNDA4Mi04MGE1LTQ4ZWJiOTBhMGQ3NCIsImFjIjoiW3tcIlNjb3BlXCI6XCJyZWZzL2hlYWRzL21haW5cIixcIlBlcm1pc3Npb25cIjozfV0iLCJhY3NsIjoiMTAiLCJvcmNoaWQiOiI4M2NjNWU2NC02ZDE0LTQzNDYtODRmZS1kM2YyZTFiMTBiZTUuZGVwbG95LW5vbWFkLWpvYi5fX2RlZmF1bHQiLCJpc3MiOiJ2c3Rva2VuLmFjdGlvbnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwiYXVkIjoidnN0b2tlbi5hY3Rpb25zLmdpdGh1YnVzZXJjb250ZW50LmNvbXx2c286N2YwMzZlMDYtMmZhNS00MmJlLTk3NGEtMTgyNzhlMWE4NjNmIiwibmJmIjoxNjg1MTMyMjYwLCJleHAiOjE2ODUxNTUwNjB9.1kbotk4UpQ_ghj506L8TMlPKPUJlEF2gqf1eaO5ZJ63iMh0G8C27AOJHlRgvDDl6DtSGCD5FXRjC9AVt-KFPCRNjK_Rf3OmQs20uN46sR_zYQheC_RwaQ4etjMWCVKvHPaq-8f5omzytEU2ltwAc8P--rTgWwXu4tYsh6Kd-4cf-gNckV5gB4flFggwbMpgEpA7KSDDnECuqppqyO0aHwzWR2NRVXlvD6FqhS2xm_3m4ZldEFANqGUHshKnwY4xKly67uH1-UMo4u19HE2ErucAMTeXDFRABvVyStJWOG9F1sZHUbqBssqcu1aVDs9SiRKS4Lj0kxAsElAYqmQF0oA";
  let github_identity_token = process.env['ACTIONS_RUNTIME_TOKEN'];

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
