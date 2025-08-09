import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import axios from 'axios';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  serverError: string | null = null; 

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;

    this.serverError = null; 

    try {
      const response = await axios.post('http://localhost:8082/api/users/register', this.registerForm.value);
      this.router.navigate(['/login']); 
    } catch (error: any) {
      console.error('Error during registration:', error);

      if (error.response && error.response.data) {
        this.serverError = error.response.data; 
      } else {
        this.serverError = 'Registration failed. Please try again.';
      }
      
    }
  }
  

goBack() {
  this.router.navigate(['/']);
}

}
