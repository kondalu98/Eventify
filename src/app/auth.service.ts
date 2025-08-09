
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  setUser(user: any) {
    user.id = Number(user.id); 
    this.userSubject.next(user);
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  login(response: any) {
    const { id, name, email, token } = response;
    const user = {
      id: Number(id), 
      name,
      email,
    };
    this.setUser(user);
    this.setToken(token);
  }
  

  updateUser(updatedUser: any) {
    this.userSubject.next(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  }

  getCurrentUser() {
    return this.userSubject.getValue();
  }

  logout() {
    this.userSubject.next(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return Boolean(this.userSubject.getValue());
  }
  
}
