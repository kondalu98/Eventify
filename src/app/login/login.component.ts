import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
 
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
 
  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
  
    if (this.loginForm.invalid) return;
  
    try {
      const response = await axios.post(
        'http://localhost:8082/api/users/login',
        this.loginForm.value
      );
  
      this.authService.login(response.data);
  
      const { name } = response.data;
  
      this.successMessage = `Welcome ${name}! You have logged in successfully.`;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
  
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = 'Invalid email or password.';
    }
  }
  
  goBack() {
    this.router.navigate(['/']);
  }
}