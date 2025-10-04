# @coat-rack/server

## 0.0.1-alpha.24

### Patch Changes

- cb111d1: Mention last updated user in appdata entities
  - @coat-rack/core@0.0.1-alpha.24

## 0.0.1-alpha.23

### Patch Changes

- @coat-rack/core@0.0.1-alpha.23

## 0.0.1-alpha.22

### Patch Changes

- Updated dependencies [0ea4c18]
  - @coat-rack/core@0.0.1-alpha.22

## 0.0.1-alpha.21

### Patch Changes

- dfd4d69: Adds docker/caddy configuration for hosting application
- ce36bfd: Ensure that caddy registration matcher is correct
  - @coat-rack/core@0.0.1-alpha.21

## 0.0.1-alpha.20

### Patch Changes

- Don't parse caddy response during registration
  - @coat-rack/core@0.0.1-alpha.20

## 0.0.1-alpha.19

### Patch Changes

- e00f3c0: Add some logging for debugging caddy issues during registration
  - @coat-rack/core@0.0.1-alpha.19

## 0.0.1-alpha.18

### Patch Changes

- 399dd2e: Fix caddy registration
  - @coat-rack/core@0.0.1-alpha.18

## 0.0.1-alpha.17

### Patch Changes

- 8f44699: Create Caddy registration in production
  - @coat-rack/core@0.0.1-alpha.17

## 0.0.1-alpha.16

### Patch Changes

- Updated dependencies [1af2e29]
  - @coat-rack/core@0.0.1-alpha.16

## 0.0.1-alpha.15

### Patch Changes

- Updated dependencies [a5f0e6b]
  - @coat-rack/core@0.0.1-alpha.15

## 0.0.1-alpha.14

### Patch Changes

- @coat-rack/core@0.0.1-alpha.14

## 0.0.1-alpha.13

### Patch Changes

- b4edca2: Creates a clean separation between different apps using isolated sandboxes

  An App's server now consists of the following structure:

  localhost:APP_PORT
  /... sandbox files
  /\_app
  /...app files
  In DEV the express app will do the relevant proxying to enable this behavior, in PROD it matches the static file structure that we're using but with a slightly updated URL structure to include the sandbox in each app's server

  - @coat-rack/core@0.0.1-alpha.13

## 0.0.1-alpha.12

### Patch Changes

- @coat-rack/core@0.0.1-alpha.12

## 0.0.1-alpha.11

### Patch Changes

- bb04bc9: Ensure that Express server resolves static files correctly in production
  - @coat-rack/core@0.0.1-alpha.11

## 0.0.1-alpha.10

### Patch Changes

- 520ee6b: fix production hosting
  - @coat-rack/core@0.0.1-alpha.10

## 0.0.1-alpha.9

### Patch Changes

- Updated dependencies [0c6d81a]
  - @coat-rack/core@0.0.1-alpha.9

## 0.0.1-alpha.8

### Patch Changes

- 7367be3: Use real versions for coat-rack packages
- Updated dependencies [7367be3]
  - @coat-rack/core@0.0.1-alpha.8

## 0.0.1-alpha.7

### Patch Changes

- b4f655e: Intercept PNPM install
  - @coat-rack/core@0.0.1-alpha.7

## 0.0.1-alpha.6

### Patch Changes

- e1ec8de: Expose server as runnable package
  - @coat-rack/core@0.0.1-alpha.6

## 0.0.1-alpha.5

### Patch Changes

- @coat-rack/core@0.0.1-alpha.5

## 0.0.1-alpha.4

### Patch Changes

- @coat-rack/core@0.0.1-alpha.4

## 0.0.1-alpha.3

### Patch Changes

- @coat-rack/core@0.0.1-alpha.3

## 0.0.1-alpha.2

### Patch Changes

- @coat-rack/core@0.0.1-alpha.2

## 0.0.1-alpha.1

### Patch Changes

- @coat-rack/core@0.0.1-alpha.1

## 0.0.1-alpha.0

### Patch Changes

- @coat-rack/core@0.0.1-alpha.0
