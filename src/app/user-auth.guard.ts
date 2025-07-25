import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userToken = localStorage.getItem('user');
    if (userToken) {
      return true;
    } else {
      alert('User login required.');
      this.router.navigate(['/login']); // redirect to login if no user is found
      return false;
    }
  }
}
