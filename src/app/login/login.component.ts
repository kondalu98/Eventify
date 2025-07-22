import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import axios from 'axios';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
   NavbarComponent
],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    try {
      const response = await axios.post('http://localhost:8082/api/users/login', this.loginForm.value);
      const { email, token } = response.data;
      alert(`Welcome ${email}!\nYour token: ${token}`);

      // localStorage.setItem('token', token);
    } catch (error: any) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  }
}
