import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const adminToken = sessionStorage.getItem('admin-token');

    if (adminToken) {
      return true;
    } else {
      alert('Admin access only. Please log in as admin.');
      this.router.navigate(['/admin']); // redirect to admin login
      return false;
    }
  }
}
