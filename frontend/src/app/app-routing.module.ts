import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RechargeComponent } from './recharge/recharge.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MobileValidationComponent } from './mobile-validation/mobile-validation.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'user-login', component: MobileValidationComponent },   // CHANGE: User Login goes to MobileValidation
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'mobile-validation', component: MobileValidationComponent }, // Optional: direct access
  { path: 'recharge', component: RechargeComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
