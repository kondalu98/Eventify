import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',

})
export class AdminComponent {
  adminForm: FormGroup;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.adminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.adminForm.invalid) return;

    const { email, password } = this.adminForm.value;
    this.loginError = null;

    try {
      const response = await axios.post(
        `http://localhost:8082/api/admin/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      const { token } = response.data;
      sessionStorage.setItem('admin-token', token);
      this.router.navigate(['/admin/dash']);

    } catch (error: any) {
      console.error('Login error:', error.response.data);
      this.loginError = 'Invalid username or password.';
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
