import { CanActivate, Router } from '@angular/router';

import { AuthAdminService } from './auth.admin.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router,private authService:AuthAdminService) {}

  canActivate(): boolean {
    const adminToken = sessionStorage.getItem('admin-token');

    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      alert('Admin access only. Please log in as admin.');
      this.router.navigate(['/admin']);
      return false;
    }
  }
}
