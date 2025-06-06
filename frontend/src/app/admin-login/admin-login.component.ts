import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apiService.adminLogin(this.loginForm.value).subscribe({
        next: (token) => {
          console.log('Received token:', token); // Debug log
          this.apiService.setToken(token); // Store raw token
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message;
          console.error('Login error:', err);
        }
      });
    }
  }
}
