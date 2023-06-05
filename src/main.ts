// @ts-check
import * as core from '@actions/core';
import * as rsasign from "jsrsasign";
import * as fs from "fs";
import fetch, { Headers } from 'node-fetch';


async function main() {
  core.info("info test")
  let nomadUrl = core.getInput('url', { required: false }) || "http://localhost:4646";
  let url = nomadUrl + "/v1/acl/login"

  console.log("url: " + url)

  let method_name = core.getInput('method_name', { required: false }) || "github";
  let token_example = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImVCWl9jbjNzWFlBZDBjaDRUSEJLSElnT3dPRSIsImtpZCI6Ijc4MTY3RjcyN0RFQzVEODAxREQxQzg3ODRDNzA0QTFDODgwRUMwRTEifQ.eyJqdGkiOiJlYmE2MGJlYy1hNGU0LTQ3ODctOWIxNi0yMGJlZDg5ZDcwOTIiLCJzdWIiOiJyZXBvOm1pa2Vub21pdGNoL25vbWFkLWdoYS1qd3QtYXV0aDpyZWY6cmVmcy9oZWFkcy9tYWluOnJlcG9zaXRvcnlfb3duZXI6bWlrZW5vbWl0Y2g6am9iX3dvcmtmbG93X3JlZjptaWtlbm9taXRjaC9ub21hZC1naGEtand0LWF1dGgvLmdpdGh1Yi93b3JrZmxvd3MvZ2l0aHViLWFjdGlvbnMtZGVtby55bWxAcmVmcy9oZWFkcy9tYWluOnJlcG9zaXRvcnlfaWQ6NjIxNDAyMzAxIiwiYXVkIjoiaHR0cHM6Ly9naXRodWIuY29tL21pa2Vub21pdGNoIiwicmVmIjoicmVmcy9oZWFkcy9tYWluIiwic2hhIjoiMWI1NjhhN2YxMTQ5ZTA2OTljYmI4OWJkM2UzYmEwNDBlMjZlNWMwYiIsInJlcG9zaXRvcnkiOiJtaWtlbm9taXRjaC9ub21hZC1naGEtand0LWF1dGgiLCJyZXBvc2l0b3J5X293bmVyIjoibWlrZW5vbWl0Y2giLCJyZXBvc2l0b3J5X293bmVyX2lkIjoiMjczMjIwNCIsInJ1bl9pZCI6IjUxNzMxMzkzMTEiLCJydW5fbnVtYmVyIjoiMzEiLCJydW5fYXR0ZW1wdCI6IjEiLCJyZXBvc2l0b3J5X3Zpc2liaWxpdHkiOiJwdWJsaWMiLCJyZXBvc2l0b3J5X2lkIjoiNjIxNDAyMzAxIiwiYWN0b3JfaWQiOiIyNzMyMjA0IiwiYWN0b3IiOiJtaWtlbm9taXRjaCIsIndvcmtmbG93IjoiTm9tYWQgR0hBIERlbW8iLCJoZWFkX3JlZiI6IiIsImJhc2VfcmVmIjoiIiwiZXZlbnRfbmFtZSI6InB1c2giLCJyZWZfdHlwZSI6ImJyYW5jaCIsIndvcmtmbG93X3JlZiI6Im1pa2Vub21pdGNoL25vbWFkLWdoYS1qd3QtYXV0aC8uZ2l0aHViL3dvcmtmbG93cy9naXRodWItYWN0aW9ucy1kZW1vLnltbEByZWZzL2hlYWRzL21haW4iLCJ3b3JrZmxvd19zaGEiOiIxYjU2OGE3ZjExNDllMDY5OWNiYjg5YmQzZTNiYTA0MGUyNmU1YzBiIiwiam9iX3dvcmtmbG93X3JlZiI6Im1pa2Vub21pdGNoL25vbWFkLWdoYS1qd3QtYXV0aC8uZ2l0aHViL3dvcmtmbG93cy9naXRodWItYWN0aW9ucy1kZW1vLnltbEByZWZzL2hlYWRzL21haW4iLCJqb2Jfd29ya2Zsb3dfc2hhIjoiMWI1NjhhN2YxMTQ5ZTA2OTljYmI4OWJkM2UzYmEwNDBlMjZlNWMwYiIsInJ1bm5lcl9lbnZpcm9ubWVudCI6ImdpdGh1Yi1ob3N0ZWQiLCJpc3MiOiJodHRwczovL3Rva2VuLmFjdGlvbnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwibmJmIjoxNjg1OTM3NDA3LCJleHAiOjE2ODU5MzgzMDcsImlhdCI6MTY4NTkzODAwN30.gSpC0jXI17bcWRKSiC9MW61KqBk0HnuwT8oUDN_x5YfDarS4sNb6l5K7yD_3BoMc8T9u4I8tsB4-XlyRRiz30362TMxOkuJi7d_1nVFCajvC8B87ZfheR2xA3_sdxkTeRBPPR4tz4crgx0JKCHijLnzQd-vTNmBLfNoeaXQ0Zxv8ZdBNErQ-XjhqcBQFZWEz34uB_Iay5Ba1ZTQxiY3bIeLP99k5I37hpFJCax4KSUlbAM-JUQjeWlGGSkT0hlfwtoveSMuezdv3cLyDoGUBabR6siimCbPPtRIwgVOa73WCuG9YPdEpEamJU4zvteQ3g99yzZEfIrMN_wk96OZGJg";
  // const githubAudience = core.getInput('jwtGithubAudience', { required: false });
  // let idToken = await core.getIDToken(githubAudience);
  // console.log("idToken", idToken);
  // let github_identity_token = idToken || token_example;

  // For testing:
  let github_identity_token = token_example;

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
    console.log("err", err);
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
    console.log("response", res.body);
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
