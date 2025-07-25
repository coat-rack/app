# @coat-rack/web

## 0.0.1-alpha.22

### Patch Changes

- 0ea4c18: Consistent handling of spaces and local user data
- Updated dependencies [0ea4c18]
  - @coat-rack/core@0.0.1-alpha.22
  - @coat-rack/sdk@0.0.1-alpha.22
  - @coat-rack/server@0.0.1-alpha.22
  - @coat-rack/icons@0.0.1-alpha.22
  - @coat-rack/ui@0.0.1-alpha.22

## 0.0.1-alpha.21

### Patch Changes

- Updated dependencies [dfd4d69]
- Updated dependencies [ce36bfd]
  - @coat-rack/server@0.0.1-alpha.21
  - @coat-rack/core@0.0.1-alpha.21
  - @coat-rack/icons@0.0.1-alpha.21
  - @coat-rack/sdk@0.0.1-alpha.21
  - @coat-rack/ui@0.0.1-alpha.21

## 0.0.1-alpha.20

### Patch Changes

- Updated dependencies
  - @coat-rack/server@0.0.1-alpha.20
  - @coat-rack/core@0.0.1-alpha.20
  - @coat-rack/icons@0.0.1-alpha.20
  - @coat-rack/sdk@0.0.1-alpha.20
  - @coat-rack/ui@0.0.1-alpha.20

## 0.0.1-alpha.19

### Patch Changes

- Updated dependencies [e00f3c0]
  - @coat-rack/server@0.0.1-alpha.19
  - @coat-rack/core@0.0.1-alpha.19
  - @coat-rack/icons@0.0.1-alpha.19
  - @coat-rack/sdk@0.0.1-alpha.19
  - @coat-rack/ui@0.0.1-alpha.19

## 0.0.1-alpha.18

### Patch Changes

- Updated dependencies [399dd2e]
  - @coat-rack/server@0.0.1-alpha.18
  - @coat-rack/core@0.0.1-alpha.18
  - @coat-rack/icons@0.0.1-alpha.18
  - @coat-rack/sdk@0.0.1-alpha.18
  - @coat-rack/ui@0.0.1-alpha.18

## 0.0.1-alpha.17

### Patch Changes

- Updated dependencies [8f44699]
  - @coat-rack/server@0.0.1-alpha.17
  - @coat-rack/core@0.0.1-alpha.17
  - @coat-rack/icons@0.0.1-alpha.17
  - @coat-rack/sdk@0.0.1-alpha.17
  - @coat-rack/ui@0.0.1-alpha.17

## 0.0.1-alpha.16

### Patch Changes

- Updated dependencies [1af2e29]
  - @coat-rack/core@0.0.1-alpha.16
  - @coat-rack/server@0.0.1-alpha.16
  - @coat-rack/icons@0.0.1-alpha.16
  - @coat-rack/sdk@0.0.1-alpha.16
  - @coat-rack/ui@0.0.1-alpha.16

## 0.0.1-alpha.15

### Patch Changes

- a5f0e6b: Fix bugs related to space changing on iframe
- Updated dependencies [a5f0e6b]
  - @coat-rack/core@0.0.1-alpha.15
  - @coat-rack/server@0.0.1-alpha.15
  - @coat-rack/icons@0.0.1-alpha.15
  - @coat-rack/sdk@0.0.1-alpha.15
  - @coat-rack/ui@0.0.1-alpha.15

## 0.0.1-alpha.14

### Patch Changes

- daf0f55: Use handshake for initializing iframes in order to ensure that iframe is completely mounted before sending message channel
  - @coat-rack/server@0.0.1-alpha.14
  - @coat-rack/core@0.0.1-alpha.14
  - @coat-rack/icons@0.0.1-alpha.14
  - @coat-rack/sdk@0.0.1-alpha.14
  - @coat-rack/ui@0.0.1-alpha.14

## 0.0.1-alpha.13

### Patch Changes

- b4edca2: Creates a clean separation between different apps using isolated sandboxes

  An App's server now consists of the following structure:

  localhost:APP_PORT
  /... sandbox files
  /\_app
  /...app files
  In DEV the express app will do the relevant proxying to enable this behavior, in PROD it matches the static file structure that we're using but with a slightly updated URL structure to include the sandbox in each app's server

- Updated dependencies [b4edca2]
  - @coat-rack/server@0.0.1-alpha.13
  - @coat-rack/core@0.0.1-alpha.13
  - @coat-rack/icons@0.0.1-alpha.13
  - @coat-rack/sdk@0.0.1-alpha.13
  - @coat-rack/ui@0.0.1-alpha.13

## 0.0.1-alpha.12

### Patch Changes

- @coat-rack/server@0.0.1-alpha.12
- @coat-rack/core@0.0.1-alpha.12
- @coat-rack/icons@0.0.1-alpha.12
- @coat-rack/sdk@0.0.1-alpha.12
- @coat-rack/ui@0.0.1-alpha.12

## 0.0.1-alpha.11

### Patch Changes

- Updated dependencies [bb04bc9]
  - @coat-rack/server@0.0.1-alpha.11
  - @coat-rack/core@0.0.1-alpha.11
  - @coat-rack/icons@0.0.1-alpha.11
  - @coat-rack/sdk@0.0.1-alpha.11
  - @coat-rack/ui@0.0.1-alpha.11

## 0.0.1-alpha.10

### Patch Changes

- 520ee6b: fix production hosting
- Updated dependencies [520ee6b]
  - @coat-rack/server@0.0.1-alpha.10
  - @coat-rack/core@0.0.1-alpha.10
  - @coat-rack/icons@0.0.1-alpha.10
  - @coat-rack/sdk@0.0.1-alpha.10
  - @coat-rack/ui@0.0.1-alpha.10

## 0.0.1-alpha.9

### Patch Changes

- Updated dependencies [0c6d81a]
  - @coat-rack/core@0.0.1-alpha.9
  - @coat-rack/server@0.0.1-alpha.9
  - @coat-rack/icons@0.0.1-alpha.9
  - @coat-rack/sdk@0.0.1-alpha.9
  - @coat-rack/ui@0.0.1-alpha.9

## 0.0.1-alpha.8

### Patch Changes

- 7367be3: Use real versions for coat-rack packages
- Updated dependencies [7367be3]
  - @coat-rack/icons@0.0.1-alpha.8
  - @coat-rack/core@0.0.1-alpha.8
  - @coat-rack/sdk@0.0.1-alpha.8
  - @coat-rack/server@0.0.1-alpha.8
  - @coat-rack/ui@0.0.1-alpha.8

## 0.0.1-alpha.7

### Patch Changes

- Updated dependencies [b4f655e]
  - @coat-rack/server@0.0.1-alpha.7
  - @coat-rack/core@0.0.1-alpha.7
  - @coat-rack/icons@0.0.1-alpha.7
  - @coat-rack/sdk@0.0.1-alpha.7
  - @coat-rack/ui@0.0.1-alpha.7

## 0.0.1-alpha.6

### Patch Changes

- Updated dependencies [e1ec8de]
  - @coat-rack/server@0.0.1-alpha.6
  - @coat-rack/core@0.0.1-alpha.6
  - @coat-rack/icons@0.0.1-alpha.6
  - @coat-rack/sdk@0.0.1-alpha.6
  - @coat-rack/ui@0.0.1-alpha.6

## 0.0.1-alpha.5

### Patch Changes

- @coat-rack/server@0.0.1-alpha.5
- @coat-rack/core@0.0.1-alpha.5
- @coat-rack/icons@0.0.1-alpha.5
- @coat-rack/sdk@0.0.1-alpha.5
- @coat-rack/ui@0.0.1-alpha.5

## 0.0.1-alpha.4

### Patch Changes

- @coat-rack/server@0.0.1-alpha.4
- @coat-rack/core@0.0.1-alpha.4
- @coat-rack/icons@0.0.1-alpha.4
- @coat-rack/sdk@0.0.1-alpha.4
- @coat-rack/ui@0.0.1-alpha.4

## 0.0.1-alpha.3

### Patch Changes

- @coat-rack/server@0.0.1-alpha.3
- @coat-rack/core@0.0.1-alpha.3
- @coat-rack/icons@0.0.1-alpha.3
- @coat-rack/sdk@0.0.1-alpha.3
- @coat-rack/ui@0.0.1-alpha.3

## 0.0.1-alpha.2

### Patch Changes

- @coat-rack/server@0.0.1-alpha.2
- @coat-rack/core@0.0.1-alpha.2
- @coat-rack/icons@0.0.1-alpha.2
- @coat-rack/sdk@0.0.1-alpha.2
- @coat-rack/ui@0.0.1-alpha.2

## 0.0.1-alpha.1

### Patch Changes

- @coat-rack/server@0.0.1-alpha.1
- @coat-rack/core@0.0.1-alpha.1
- @coat-rack/icons@0.0.1-alpha.1
- @coat-rack/sdk@0.0.1-alpha.1
- @coat-rack/ui@0.0.1-alpha.1

## 0.0.1-alpha.0

### Patch Changes

- Updated dependencies [d0eca11]
  - @coat-rack/sdk@0.0.1-alpha.0
  - @coat-rack/server@0.0.1-alpha.0
  - @coat-rack/core@0.0.1-alpha.0
  - @coat-rack/icons@0.0.1-alpha.0
  - @coat-rack/ui@0.0.1-alpha.0
