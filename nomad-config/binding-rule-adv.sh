nomad acl binding-rule create \
    -description "repo name mapped to role name, on main branch, for “Nomad JWT Auth workflow" \
    -auth-method "github-adv" \
    -bind-name "${value.repo}" \
    -selector "value.owner == \"mikenomitch\" && value.workflow = \"Nomad JWT Auth\" && value.ref == \"refs/heads/main\""