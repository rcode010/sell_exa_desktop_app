export interface SecureToken {
  save: (token: string) => Promise<{ success: boolean; error?: unknown }>;
  get: () => Promise<string | null>;
  clear: () => Promise<boolean>;
}

declare global {
  interface Window {
    secureToken: SecureToken;
  }
}
