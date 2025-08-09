import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;
  userId: number = 0;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    this.userId = user.id;

    this.userForm = this.fb.group({
      name: [user.name, Validators.required],
      email: [{ value: user.email, disabled: true }],
      password: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  updateProfile() {
    if (this.userForm.invalid) return;

    const storedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (!storedUser || !token) return;

    const formValues = this.userForm.getRawValue();
    const url = `http://localhost:8082/api/users/update/${this.userId}`;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(url, formValues, { headers }).subscribe({
      next: (response: any) => {
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';

        const updatedUser = JSON.parse(storedUser);
        updatedUser.name = this.userForm.value.name;
        updatedUser.contactNumber = this.userForm.value.contactNumber;
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (error) => {
        console.error('Update failed', error);
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.successMessage = '';
      }
    });
  }

  goBack() {
    this.location.back();
  }

  onclick() {
    this.router.navigate(['/tickets']);
  }
}
