import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthAdminService {
  getToken(): string | null {
    return localStorage.getItem('admin-token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  isLoggedIn(): boolean {
  return Boolean(this.getToken());
}

  logout(): void {
    localStorage.removeItem('admin-token');
  }
}
