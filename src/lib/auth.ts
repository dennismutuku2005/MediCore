/**
 * Authentication Service — Single source of truth.
 * Connects directly to the Spring Boot API at /api/auth
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const TOKEN_KEY = 'medical_auth_token';
const USER_KEY  = 'medical_user_data';

export interface UserData {
  id:       number;
  name:     string;
  username: string;
  role:     string;  // 'admin' | 'doctor' | 'nurse' | 'labtech' | 'patient'
  email:    string;
  ward?:    any;
}

export interface LoginResult {
  success: boolean;
  data?:   { token: string; user: UserData };
  message?: string;
}

class AuthService {
  /** Call the Spring Boot login endpoint */
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const response = await fetch(`${API_BASE}/auth?action=login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === 'success' && data.data?.token) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
        return { success: true, data: data.data };
      }

      return { success: false, message: data.message || 'Login failed' };
    } catch {
      return { success: false, message: 'Network error. Is the API running on port 8080?' };
    }
  }

  /** Clear stored credentials */
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /** True if a token exists in storage */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): UserData | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  setUser(user: UserData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /** Make an authenticated API request */
  async authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (response.status === 401 && !endpoint.includes('/auth')) {
      this.logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }

    return response;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const authService = new AuthService();
export default authService;

// ── Convenience named helpers (used by GenericLayout, Sidebar & root page) ───
export function getRole(): string | null {
  return authService.getUser()?.role?.toLowerCase() ?? null;
}

export function getUsername(): string | null {
  return authService.getUser()?.name ?? authService.getUser()?.username ?? null;
}

/** Named logout — calls authService.logout() (used by Sidebar) */
export function logout(): void {
  authService.logout();
}

/** Role-based redirect path */
export function roleRedirectPath(role: string | null | undefined): string {
  switch (role?.toLowerCase()) {
    case 'admin':   return '/admin/dashboard';
    case 'doctor':  return '/doctor/dashboard';
    case 'nurse':   return '/nurse/dashboard';
    case 'labtech': return '/labtech/dashboard';
    case 'patient': return '/patient/dashboard';
    default:        return '/dashboard';
  }
}
