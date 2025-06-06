import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-validation',
  templateUrl: './mobile-validation.component.html',
  styleUrls: ['./mobile-validation.component.css']
})
export class MobileValidationComponent {
  validationForm: FormGroup;
  registrationForm: FormGroup;
  errorMessage: string | null = null;
  showRegistration: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.validationForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      mobileNumber: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.validationForm.valid) {
      const mobileNumber = this.validationForm.value.mobileNumber;
      this.apiService.findSubscriber(mobileNumber).subscribe({
        next: (subscriber) => {
          // Subscriber exists, proceed to recharge
          this.router.navigate(['/recharge'], { state: { subscriber } });
        },
        error: () => {
          // Subscriber not found, show registration
          this.showRegistration = true;
          this.registrationForm.patchValue({ mobileNumber });
        }
      });
    }
  }

  onRegister(): void {
    this.errorMessage = null;
    if (this.registrationForm.valid) {
      // Get the value including disabled fields
      const registrationData = {
        ...this.registrationForm.getRawValue()
      };
      this.apiService.registerSubscriber(registrationData).subscribe({
        next: (subscriber) => {
          this.router.navigate(['/recharge'], { state: { subscriber } });
        },
        error: err => this.errorMessage = err.message || 'Registration failed'
      });
    }
  }
}