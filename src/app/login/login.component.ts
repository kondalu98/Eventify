import { Component, inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import axios from "axios";
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from "@angular/common";
import { AuthService } from '../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  // ✅ Inject here


  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // ✅ inject properly
    private router: Router            // ✅ inject router
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
      const response = await axios.post('http://localhost:8082/api/users/login', this.loginForm.value);
      const { id,email,name ,token} = response.data;

      console.log(response.data);
      this.successMessage = `Welcome ${name}! You have logged in successfully.`;

// Save token and user info
localStorage.setItem('user', JSON.stringify(response.data));
this.authService.setUser({ id,name, email });

// Wait 1.5 seconds before navigating
setTimeout(() => {
  this.router.navigate(['/']);
}, 1500);


      localStorage.setItem('user', JSON.stringify(response.data));

      await this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = 'Invalid email or password.';
    }
  }
}
