nomad acl binding-rule create \
    -description "repo to mgmt" \
    -auth-method "github" \
    -bind-type "management" \
    -selector "value.owner == mikenomitch"