# Nomad JWT Auth Action

A GitHub Action to mint a short-lived Nomad token using GHA identity tokens and arbitrary JWTs.

If you provide an input of "identityToken", that will be used as the JWT to authorize into Nomad. If you do not provide an "identityToken" argument, the Github Action Identity token will be used.

## Remaining To Dos

* Document how to set up role/policy access and a more complex JWT
* Document the permissions you need at the GHA level to get JWT acces

## Usage

See [action.yml](action.yml)

Must include the id-token `write` permission and contents `read` permission.

Example:
```
env:
  PRODUCT_VERSION: "1.5.6"
  NOMAD_ADDR: "http://my-nomad-addr.foo:4646"

jobs:
  Check-Nomad-Status:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup `nomad`
        uses: lucasmelin/setup-nomad@v1
        id: setup
        with:
          version: ${{ env.PRODUCT_VERSION }}
      - name: Run `nomad version`
        run: "nomad version"
      - name: Auth Into Nomad
        id: nomad-jwt-auth
        uses: mikenomitch/nomad-jwt-auth@v1
        with:
          url: ${{ env.NOMAD_ADDR }}
        continue-on-error: true
      - name: Get Status
        run: NOMAD_ADDR="${{ env.NOMAD_ADDR }}" NOMAD_TOKEN="${{ steps.nomad-jwt-auth.outputs.nomadToken }}" nomad status

```

## Setting up Simple Auth for Github Actions

#### Create an Auth Method

Let's set up a simple auth method in Nomad to test authenticating via Github Actions identity tokens.

First we'll need an Auth Method. This tells Nomad that we'll have a new way of authenticating new users. We'll call it `github` and say that it is a "JWT" based method for machine-to-machine auth, instead of OIDC for human-based SSO.

The contents in `./nomad-config/auth-method.json` say that we'll validate the signature of this JWT with the Github public key at JWKSURL. And we'll map the JWT's value of "repository_owner" to an internal value of "owner". This is important because for this auth method, we'll simply trust that if the owner is "mikenomitch", we'll grant a short lived management token (note: this is unrealistic and insecure).

Run the following to create an auth method for this action:
```
nomad acl auth-method create -name="github" -type="JWT" -max-token-ttl="23h" -token-locality=global -config "@nomad-config/auth-method.json"
```

The contents of `./nomad-config/auth-method.json`:
```
{
  "JWKSURL": "https://token.actions.githubusercontent.com/.well-known/jwks",
  "ExpirationLeeway": "1h",
  "ClockSkewLeeway": "1h",
  "ClaimMappings": {
    "repository_owner": "owner"
  }
}
```

Confirm that it works with: `nomad operator api /v1/acl/auth-method/github`

#### Create a Binding Rule

Next, we'll create a binding rule. This tells Nomad which values from a specified Auth Method should map to roles, polices, or management tokens in Nomad.

In our case, we'll keep it simple and say that if the repo owner is "mikenomitch", they're granted a management token.

Run the following to update the action for this action:
```
nomad acl binding-rule create \
    -description "repo to mgmt" \
    -auth-method "github" \
    -bind-type "management" \
    -selector "value.owner == mikenomitch"
```

#### Run the Github Action

Now when you run this github action. If you point to this cluster and have the correct owner specified, you will be authorized to access Nomad.

## Setting up a more realistic Auth Method for Github Actions

TODO

### Notes

See the file `./jws-example.json` for an example of the fields availible in the JWT.

See the dir `./nomad-config` for some helpful files for testing local config with Nomad.

## Development

To make changes, edit `src/main.ts` and then run `npm run build`.

You can run main locally with `npm run build && node dist/index.js` which can be helpful for development & debugging.

