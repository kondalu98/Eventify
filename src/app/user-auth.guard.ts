import { CanActivate, Router } from '@angular/router';

import { AuthAdminService } from './auth.admin.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthGuard implements CanActivate {
  constructor(private router: Router,private authservice:AuthAdminService) {}

  canActivate(): boolean {
    const userToken = localStorage.getItem('user');
    if (userToken) {
      return true;
    } else {
      alert('User login required.');
      this.router.navigate(['/login']); 
      return false;
    }
  }
}
