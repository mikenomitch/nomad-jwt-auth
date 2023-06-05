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
  let token_example = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImVCWl9jbjNzWFlBZDBjaDRUSEJLSElnT3dPRSJ9.eyJuYW1laWQiOiJkZGRkZGRkZC1kZGRkLWRkZGQtZGRkZC1kZGRkZGRkZGRkZGQiLCJzY3AiOiJBY3Rpb25zLkdlbmVyaWNSZWFkOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCBBY3Rpb25zLlVwbG9hZEFydGlmYWN0czowMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAvMTpCdWlsZC9CdWlsZC8yNiBEaXN0cmlidXRlZFRhc2suR2VuZXJhdGVJZFRva2VuOmIwYzI2MTNlLWE4OTctNDFlOS04YjYwLWE1YWZmN2UwZDEzYTo2ODkzNTkyYS1kNDhhLTUwZGEtMjQ0Yi01ODc0ZTZkYWY5ZmUgTG9jYXRpb25TZXJ2aWNlLkNvbm5lY3QgUmVhZEFuZFVwZGF0ZUJ1aWxkQnlVcmk6MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwLzE6QnVpbGQvQnVpbGQvMjYiLCJJZGVudGl0eVR5cGVDbGFpbSI6IlN5c3RlbTpTZXJ2aWNlSWRlbnRpdHkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiJERERERERERC1ERERELUREREQtRERERC1EREREREREREREREQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ByaW1hcnlzaWQiOiJkZGRkZGRkZC1kZGRkLWRkZGQtZGRkZC1kZGRkZGRkZGRkZGQiLCJhdWkiOiJlNmE0NDkwYy1iZGZhLTQ5MGYtYjM1ZS05MjE1MTlkYjZlZDIiLCJzaWQiOiJlMWYwOGI3My05MTA1LTQ3NWItODQ0NS0xNDk2ZDRhZDY0YmQiLCJhYyI6Ilt7XCJTY29wZVwiOlwicmVmcy9oZWFkcy9tYWluXCIsXCJQZXJtaXNzaW9uXCI6M31dIiwiYWNzbCI6IjEwIiwib2lkY19leHRyYSI6IntcInJlZlwiOlwicmVmcy9oZWFkcy9tYWluXCIsXCJzaGFcIjpcImYwYmI2NDVlYmQ5YzY2ZGIzNmMzY2IyYjE3MzQ2ZTQ2ZmUxYmM5OWJcIixcInJlcG9zaXRvcnlcIjpcIm1pa2Vub21pdGNoL25vbWFkLWdoYS1qd3QtYXV0aFwiLFwicmVwb3NpdG9yeV9vd25lclwiOlwibWlrZW5vbWl0Y2hcIixcInJlcG9zaXRvcnlfb3duZXJfaWRcIjpcIjI3MzIyMDRcIixcInJ1bl9pZFwiOlwiNTA5NTI5NzE0NFwiLFwicnVuX251bWJlclwiOlwiMjdcIixcInJ1bl9hdHRlbXB0XCI6XCIxXCIsXCJyZXBvc2l0b3J5X3Zpc2liaWxpdHlcIjpcInB1YmxpY1wiLFwicmVwb3NpdG9yeV9pZFwiOlwiNjIxNDAyMzAxXCIsXCJhY3Rvcl9pZFwiOlwiMjczMjIwNFwiLFwiYWN0b3JcIjpcIm1pa2Vub21pdGNoXCIsXCJ3b3JrZmxvd1wiOlwiTm9tYWQgR0hBIERlbW9cIixcImhlYWRfcmVmXCI6XCJcIixcImJhc2VfcmVmXCI6XCJcIixcImV2ZW50X25hbWVcIjpcInB1c2hcIixcInJlZl90eXBlXCI6XCJicmFuY2hcIixcIndvcmtmbG93X3JlZlwiOlwibWlrZW5vbWl0Y2gvbm9tYWQtZ2hhLWp3dC1hdXRoLy5naXRodWIvd29ya2Zsb3dzL2dpdGh1Yi1hY3Rpb25zLWRlbW8ueW1sQHJlZnMvaGVhZHMvbWFpblwiLFwid29ya2Zsb3dfc2hhXCI6XCJmMGJiNjQ1ZWJkOWM2NmRiMzZjM2NiMmIxNzM0NmU0NmZlMWJjOTliXCIsXCJqb2Jfd29ya2Zsb3dfcmVmXCI6XCJtaWtlbm9taXRjaC9ub21hZC1naGEtand0LWF1dGgvLmdpdGh1Yi93b3JrZmxvd3MvZ2l0aHViLWFjdGlvbnMtZGVtby55bWxAcmVmcy9oZWFkcy9tYWluXCIsXCJqb2Jfd29ya2Zsb3dfc2hhXCI6XCJmMGJiNjQ1ZWJkOWM2NmRiMzZjM2NiMmIxNzM0NmU0NmZlMWJjOTliXCIsXCJydW5uZXJfZW52aXJvbm1lbnRcIjpcImdpdGh1Yi1ob3N0ZWRcIn0iLCJvaWRjX3N1YiI6InJlcG86bWlrZW5vbWl0Y2gvbm9tYWQtZ2hhLWp3dC1hdXRoOnJlZjpyZWZzL2hlYWRzL21haW46cmVwb3NpdG9yeV9vd25lcjptaWtlbm9taXRjaDpqb2Jfd29ya2Zsb3dfcmVmOm1pa2Vub21pdGNoL25vbWFkLWdoYS1qd3QtYXV0aC8uZ2l0aHViL3dvcmtmbG93cy9naXRodWItYWN0aW9ucy1kZW1vLnltbEByZWZzL2hlYWRzL21haW46cmVwb3NpdG9yeV9pZDo2MjE0MDIzMDEiLCJvcmNoaWQiOiJiMGMyNjEzZS1hODk3LTQxZTktOGI2MC1hNWFmZjdlMGQxM2EuZGVwbG95LW5vbWFkLWpvYi5fX2RlZmF1bHQiLCJpc3MiOiJ2c3Rva2VuLmFjdGlvbnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwiYXVkIjoidnN0b2tlbi5hY3Rpb25zLmdpdGh1YnVzZXJjb250ZW50LmNvbXx2c286N2YwMzZlMDYtMmZhNS00MmJlLTk3NGEtMTgyNzhlMWE4NjNmIiwibmJmIjoxNjg1MTM4MTY1LCJleHAiOjE2ODUxNjA5NjV9.F56gYL-jG6bZbwIuHoJKeCS1IjPHib-lNdsUEiW4uLMvsHwFDdE2eQWHEwVpHsIegQyJfPxwCxbBWqUApdgn-Qjp8odTLceII7Vep-juFj_YleLS5E6KqXssI9LFRM_imnwFAEggop40jAhrSIaDwV8UKH8u61mvT1fJi8QJqk7VJLFUwrB0dH5eRe666kkUD-iedF1c5iwKsKB1VQTPROv4MmjiNFx65y-xuxufLTtE8lfq9pG__rhF3VZx31Rz5NTLEAwGg0EoDs0RGBjCg9AJ4HpL2Ve2En2vJzXtd1wlXUnuO8o37QHgyBBkt6oNH0vPTRLJID-wGW3JpqQKfw";
  const githubAudience = core.getInput('jwtGithubAudience', { required: false });
  let idToken = await core.getIDToken(githubAudience);
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
