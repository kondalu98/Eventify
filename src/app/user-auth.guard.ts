import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userToken = sessionStorage.getItem('user');
    if (userToken) {
      return true;
    } else {
      alert('User login required.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
