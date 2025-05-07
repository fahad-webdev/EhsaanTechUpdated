export interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}
export interface LoginFormData {
    email: string
    password: string
  }
export interface AuthContextProps {
    token: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    isAuthenticated: boolean;
  }