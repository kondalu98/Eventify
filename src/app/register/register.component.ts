import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      try {
        const response = await axios.post('http://localhost:8082/api/users/register', this.registerForm.value, {
          headers: { 'Content-Type': 'application/json' }
        });
        alert(`Welcome, ${response.data.name}!`);
      } catch (error) {
        alert('Registration failed. Please try again.');
        console.error('Register error:', error);
      }
    }
  }
}
