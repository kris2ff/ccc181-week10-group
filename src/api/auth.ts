// All calls to the CampusConnect API live here. Components call these
// functions instead of calling fetch directly.
import type { LoginResult, User } from '../types';

const API_URL: string = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'campusconnect_token';

// kind tells the screen WHAT happened, so it can show a friendly message.
export type AuthErrorKind = 'invalid' | 'unauthorized' | 'network' | 'server';

export class AuthError extends Error {
  kind: AuthErrorKind;
  constructor(kind: AuthErrorKind) {
    super(kind);
    this.kind = kind;
  }
}

async function send(path: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, init);
  } catch {
    // server stopped, wrong address, CORS block: never show raw text
    throw new AuthError('network');
  }
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const response = await send('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (response.status === 400 || response.status === 401) throw new AuthError('invalid');
  if (!response.ok) throw new AuthError('server');
  return (await response.json()) as LoginResult;
}

export async function getMe(token: string): Promise<User> {
  const response = await send('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401) throw new AuthError('unauthorized');
  if (!response.ok) throw new AuthError('server');
  return (await response.json()) as User;
}

// The token lives in sessionStorage only (never in the URL or in console.log).
export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function loadToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}
export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}
