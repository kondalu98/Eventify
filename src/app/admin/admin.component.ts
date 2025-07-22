import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './admin.component.html',
  
})
export class AdminComponent {

  adminForm: FormGroup;
  
  constructor(private fb: FormBuilder,private router: Router) {
    this.adminForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.adminForm.invalid) return;
  
    const { email, password } = this.adminForm.value;
  
  
    try {
      const response = await axios.post(
        `http://localhost:8082/api/admin/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );
  
      const { token } = response.data;
      alert(`Welcome ${email}!\nYour token: ${token}`);
      localStorage.setItem('admin-token', token);
      this.router.navigate(['/admin/dash']); 
    } catch (error: any) {
      console.error('Login error:', error?.response?.data || error);
      alert(' Admin Login failed. Please check your credentials.');
    }
  }
  
}

