import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Plan, Subscriber } from '../models/modles';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit, AfterViewInit {
  rechargeForm: FormGroup;
  plans: Plan[] = [];
  subscriber: Subscriber | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isInitialized = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.rechargeForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      planId: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentDetails: [''], // UPI

      // Card fields
      cardNumber: [''],
      expiry: [''],
      cvv: ['']
    });

    // Dynamic validation
    this.rechargeForm.get('paymentMethod')?.valueChanges.subscribe((value) => {
      const upi = this.rechargeForm.get('paymentDetails');
      const cardNumber = this.rechargeForm.get('cardNumber');
      const expiry = this.rechargeForm.get('expiry');
      const cvv = this.rechargeForm.get('cvv');

      if (value === 'UPI') {
        upi?.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]+@[a-zA-Z]+')
        ]);
        cardNumber?.clearValidators();
        expiry?.clearValidators();
        cvv?.clearValidators();
      } else if (value === 'Card') {
        upi?.clearValidators();
        cardNumber?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{16}$')
        ]);
        expiry?.setValidators([
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])/\\d{2}$')
        ]);
        cvv?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{3}$')
        ]);
      }

      upi?.updateValueAndValidity({ emitEvent: false });
      cardNumber?.updateValueAndValidity({ emitEvent: false });
      expiry?.updateValueAndValidity({ emitEvent: false });
      cvv?.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.subscriber = history.state.subscriber;
    this.apiService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.rechargeForm.get('planId')?.setValue('');
        setTimeout(() => {
          this.isInitialized = true;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load plans. Please try again.';
        this.isInitialized = true;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.subscriber) {
      setTimeout(() => {
        if (this.subscriber?.mobileNumber) {
          this.rechargeForm.patchValue({ mobileNumber: this.subscriber.mobileNumber });
        }
        this.cdr.detectChanges();
      }, 0);
    }
  }

  onSubmit(): void {
    if (this.rechargeForm.valid) {
      const request = { ...this.rechargeForm.value };

      // Clean up the request based on payment method
      if (request.paymentMethod === 'UPI') {
        delete request.cardNumber;
        delete request.expiry;
        delete request.cvv;
      } else {
        delete request.paymentDetails;
      }

      this.apiService.recharge(request).subscribe({
        next: (response) => {
          this.successMessage = `Transaction ID: ${response.transactionId}`;
          this.cdr.detectChanges();
          // setTimeout(() => this.router.navigate(['/']), 3000);
        },
        error: (err) => {
          console.error('API Error:', err);
          console.error('Backend error message:', err.error);
          this.errorMessage = err.error?.message || err.message || 'Recharge failed. Please try again.';
          this.cdr.detectChanges();
        }
      });
    }
  }
  goHome(): void {
  this.router.navigate(['/']);
}
}

