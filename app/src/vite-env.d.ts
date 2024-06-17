/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_CUSTOM_ENV_VARIABLE: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
