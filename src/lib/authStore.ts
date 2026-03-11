let accessToken: string | null = null;
let isReady = false;
let readyResolve: (() => void) | null = null;
export const authReady = new Promise<void>((resolve) => {
  readyResolve = resolve;
});

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (!isReady) {
    isReady = true;
    readyResolve?.();
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
}
