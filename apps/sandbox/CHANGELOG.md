# @coat-rack/sandbox

## 0.0.1-alpha.15

### Patch Changes

- a5f0e6b: Fix bugs related to space changing on iframe
- Updated dependencies [a5f0e6b]
  - @coat-rack/core@0.0.1-alpha.15
  - @coat-rack/sdk@0.0.1-alpha.15

## 0.0.1-alpha.14

### Patch Changes

- daf0f55: Use handshake for initializing iframes in order to ensure that iframe is completely mounted before sending message channel
  - @coat-rack/core@0.0.1-alpha.14
  - @coat-rack/sdk@0.0.1-alpha.14

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
  - @coat-rack/sdk@0.0.1-alpha.13

## 0.0.1-alpha.12

### Patch Changes

- @coat-rack/core@0.0.1-alpha.12
- @coat-rack/sdk@0.0.1-alpha.12

## 0.0.1-alpha.11

### Patch Changes

- @coat-rack/core@0.0.1-alpha.11
- @coat-rack/sdk@0.0.1-alpha.11

## 0.0.1-alpha.10

### Patch Changes

- 520ee6b: fix production hosting
  - @coat-rack/core@0.0.1-alpha.10
  - @coat-rack/sdk@0.0.1-alpha.10

## 0.0.1-alpha.9

### Patch Changes

- Updated dependencies [0c6d81a]
  - @coat-rack/core@0.0.1-alpha.9
  - @coat-rack/sdk@0.0.1-alpha.9

## 0.0.1-alpha.8

### Patch Changes

- 7367be3: Use real versions for coat-rack packages
- Updated dependencies [7367be3]
  - @coat-rack/core@0.0.1-alpha.8
  - @coat-rack/sdk@0.0.1-alpha.8

## 0.0.1-alpha.7

### Patch Changes

- @coat-rack/core@0.0.1-alpha.7
- @coat-rack/sdk@0.0.1-alpha.7

## 0.0.1-alpha.6

### Patch Changes

- @coat-rack/core@0.0.1-alpha.6
- @coat-rack/sdk@0.0.1-alpha.6

## 0.0.1-alpha.5

### Patch Changes

- @coat-rack/core@0.0.1-alpha.5
- @coat-rack/sdk@0.0.1-alpha.5

## 0.0.1-alpha.4

### Patch Changes

- @coat-rack/core@0.0.1-alpha.4
- @coat-rack/sdk@0.0.1-alpha.4

## 0.0.1-alpha.3

### Patch Changes

- @coat-rack/core@0.0.1-alpha.3
- @coat-rack/sdk@0.0.1-alpha.3

## 0.0.1-alpha.2

### Patch Changes

- @coat-rack/core@0.0.1-alpha.2
- @coat-rack/sdk@0.0.1-alpha.2

## 0.0.1-alpha.1

### Patch Changes

- @coat-rack/core@0.0.1-alpha.1
- @coat-rack/sdk@0.0.1-alpha.1

## 0.0.1-alpha.0

### Patch Changes

- Updated dependencies [d0eca11]
  - @coat-rack/sdk@0.0.1-alpha.0
  - @coat-rack/core@0.0.1-alpha.0
