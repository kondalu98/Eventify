import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  setUser(user: any) {
    user.id = Number(user.id); // ✅ ensure it's a number before storing
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  getUser() {
  const userStr = localStorage.getItem('user'); // assuming user is stored in localStorage
  return userStr ? JSON.parse(userStr) : null;
}

  login(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: +response.id, // Convert string to number
      name: response.name,
      email: response.email
    }));
  }


  updateUser(updatedUser: any) {
    this.userSubject.next(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  getCurrentUser() {
    return this.userSubject.getValue();
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.getValue();
  }
}
