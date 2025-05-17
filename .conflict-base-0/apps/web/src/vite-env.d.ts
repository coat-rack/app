/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_PORT: string
  readonly VITE_SANDBOX_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
