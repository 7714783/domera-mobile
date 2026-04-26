// DEPRECATED shim — this file predates the centralized api client. Kept as a
// compatibility alias so anything that still imports from '@/lib/api' keeps
// working while the codebase migrates. New code must import from:
//
//   import { apiFetch } from '../api/client';
//
// This module will be deleted once all imports are migrated.
import { env } from '../config/env';
export { apiFetch as apiGet } from '../api/client';
export { env as _env } from '../config/env';
export const API_BASE_URL = env.apiBase;
