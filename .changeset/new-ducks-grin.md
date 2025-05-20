---
"@coat-rack/sandbox": patch
"@coat-rack/server": patch
"@coat-rack/web": patch
---

Creates a clean separation between different apps using isolated sandboxes

An App's server now consists of the following structure:

localhost:APP_PORT
/... sandbox files
/\_app
/...app files
In DEV the express app will do the relevant proxying to enable this behavior, in PROD it matches the static file structure that we're using but with a slightly updated URL structure to include the sandbox in each app's server
