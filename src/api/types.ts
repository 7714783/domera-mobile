// Shared transport types. Contracts with the backend are intentionally kept
// thin here — concrete domain DTOs live in each module under api/.

export type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  code?: string;
};

export class ApiError extends Error {
  status: number;
  code: string | null;
  serverMessage: string | null;
  body: unknown;

  constructor(params: {
    status: number;
    message: string;
    body: unknown;
    code?: string | null;
    serverMessage?: string | null;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code ?? null;
    this.serverMessage = params.serverMessage ?? null;
    this.body = params.body;
  }
}

export type Paginated<T> = {
  total: number;
  items: T[];
};

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  // Skip the 401 → session-clear hook for endpoints where 401 is meaningful
  // (like the login endpoint itself).
  skipAuthRedirect?: boolean;
  // Per-request timeout in ms (defaults to 15s).
  timeoutMs?: number;
};
