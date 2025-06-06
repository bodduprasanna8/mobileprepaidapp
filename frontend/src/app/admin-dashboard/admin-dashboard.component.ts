import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Recharge, Subscriber, Plan } from '../models/modles';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  historyForm: FormGroup;
  planForm: FormGroup;
  expiringSubscribers: Subscriber[] = [];
  rechargeHistory: Recharge[] = [];
  plans: Plan[] = [];

  isEditing = false;
  editPlanId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // For category dropdown
  categories = [
    { value: 'Popular', label: 'Popular' },
    { value: 'Validity', label: 'Validity' },
    { value: 'Data', label: 'Data' },
    { value: 'Unlimited', label: 'Unlimited' },
    { value: 'Special', label: 'Special' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.historyForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });

    this.planForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      validityDays: ['', Validators.required],
      category: ['', Validators.required],
      dataPerDay: [''],
      calls: [''],
      sms: ['']
    });
  }

  ngOnInit(): void {
    this.loadExpiringSubscribers();
    this.loadPlans();
  }

  loadExpiringSubscribers(): void {
    this.apiService.getExpiringSubscribers().subscribe({
      next: (subscribers) => {
        this.expiringSubscribers = subscribers;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load expiring subscribers.';
        console.error(err);
      }
    });
  }

  loadPlans(): void {
    this.apiService.getAllPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load plans.';
        console.error(err);
      }
    });
  }

  onHistorySubmit(): void {
    if (this.historyForm.valid) {
      const mobileNumber = this.historyForm.value.mobileNumber;
      this.apiService.getRechargeHistory(mobileNumber).subscribe({
        next: (history) => {
          this.rechargeHistory = history;
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load recharge history.';
          console.error(err);
        }
      });
    }
  }

  onAddOrUpdatePlan(): void {
    if (this.planForm.valid) {
      const planData = this.planForm.value;
      if (this.isEditing && this.editPlanId !== null) {
        // Update existing plan
        this.apiService.updatePlan(this.editPlanId, planData).subscribe({
          next: (updatedPlan) => {
            this.successMessage = 'Plan updated successfully.';
            this.resetPlanForm();
            this.loadPlans();
          },
          error: (err) => {
            this.errorMessage = 'Failed to update plan.';
            console.error(err);
          }
        });
      } else {
        // Add new plan
        this.apiService.addPlan(planData).subscribe({
          next: (newPlan) => {
            this.successMessage = 'Plan added successfully.';
            this.resetPlanForm();
            this.loadPlans();
          },
          error: (err) => {
            this.errorMessage = 'Failed to add plan.';
            console.error(err);
          }
        });
      }
    }
  }

  onEditPlan(plan: Plan): void {
    this.planForm.patchValue({
      name: plan.name,
      price: plan.price,
      validityDays: plan.validityDays,
      category: plan.category,
      dataPerDay: plan.dataPerDay,
      calls: plan.calls,
      sms: plan.sms
    });
    this.isEditing = true;
    this.editPlanId = plan.id;
  }

  onDeletePlan(planId: number): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.apiService.deletePlan(planId).subscribe({
        next: () => {
          this.successMessage = 'Plan deleted successfully.';
          this.loadPlans();
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete plan.';
          console.error(err);
        }
      });
    }
  }

  resetPlanForm(): void {
    this.planForm.reset();
    this.isEditing = false;
    this.editPlanId = null;
  }
}