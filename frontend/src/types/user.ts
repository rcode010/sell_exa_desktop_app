export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserStore {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  loading: boolean;
  setHydrated: () => void;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  setAccessToken: (token: string) => void;
}
