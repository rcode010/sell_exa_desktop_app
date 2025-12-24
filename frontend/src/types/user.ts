export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  role: string;
}
export interface newUser {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNo: string;
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
