export function login(username: string, _password: string): string | null {
  const roles: Record<string, string> = {
    admin: 'admin',
    doctor: 'doctor',
    nurse: 'nurse',
    patient: 'patient',
    labtech: 'labtech',
  };
  return roles[username.toLowerCase()] ?? null;
}

export function getRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hms_role');
}

export function getUsername(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hms_username');
}

export function setRole(role: string) {
  localStorage.setItem('hms_role', role);
  localStorage.setItem('hms_username', role);
}

export function logout() {
  localStorage.removeItem('hms_role');
  localStorage.removeItem('hms_username');
}
