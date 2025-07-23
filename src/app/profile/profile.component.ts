import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Location } from '@angular/common'; // ⬅️ Import this
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;
  userId: number = 0;
  successMessage = '';
  errorMessage = '';

constructor(private fb: FormBuilder, private router: Router, private location: Location) {}


  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    this.userId = user.id;

    this.userForm = this.fb.group({
  name: [user.name, Validators.required],
  email: [{ value: user.email, disabled: true }], // ✅ Correctly mark as disabled
  password: ['', [Validators.required, Validators.minLength(6)]],
  contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
});

  }

  async updateProfile() {
    if (this.userForm.invalid) return;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const { token } = JSON.parse(storedUser);

    try {
      const response = await axios.put(
        `http://localhost:8082/api/users/update/${this.userId}`,
        this.userForm.getRawValue(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.successMessage = 'Profile updated successfully!';
      this.errorMessage = '';

      // Update localStorage with new name if needed
      const updatedUser = JSON.parse(localStorage.getItem('user')!);
      updatedUser.name = this.userForm.value.name;
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Update failed', err);
      this.errorMessage = 'Failed to update profile. Please try again.';
      this.successMessage = '';
    }
  }
//   logout() {
//   localStorage.removeItem('user');
//   this.router.navigate(['/']);
// }
goBack() {
  this.location.back();
}

}
