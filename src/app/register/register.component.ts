import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;

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

    try {
      const response = await axios.post('http://localhost:8082/api/users/register', this.registerForm.value);
      alert('Registered Successfully!');
      this.router.navigate(['/login']); 
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed.');
    }
  }
}
