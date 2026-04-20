// Centralized environment accessor. Every module imports env through this
// file — never from process.env or Constants directly. Makes it trivial to
// swap dev/test/prod at build time via expo-constants extras or EAS profiles.

import Constants from 'expo-constants';

type Env = {
  apiBase: string;
  environment: 'development' | 'test' | 'production';
};

const extras = (Constants.expoConfig?.extra ?? {}) as Partial<Env>;

const resolvedEnv: Env['environment'] =
  extras.environment === 'production'
    ? 'production'
    : extras.environment === 'test'
      ? 'test'
      : 'development';

export const env: Env = {
  apiBase: extras.apiBase?.trim() || 'http://localhost:4000',
  environment: resolvedEnv,
};

export const isDev = env.environment !== 'production';
