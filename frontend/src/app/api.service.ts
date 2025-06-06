import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminLoginRequest, MobileValidationRequest, RechargeRequest, RechargeResponse, Plan, Subscriber, Recharge } from './models/modles';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8123/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  adminLogin(request: AdminLoginRequest): Observable<string> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/admin/login`, request)
      .pipe(map(response => {
        if (!response.token) throw new Error('No token received');
        this.setToken(response.token);
        return response.token;
      }), catchError(this.handleError));
  }

  // Validate if subscriber exists
  findSubscriber(mobileNumber: string): Observable<Subscriber> {
    return this.http.get<Subscriber>(`${this.apiUrl}/subscribers/find?mobileNumber=${mobileNumber}`)
      .pipe(catchError(this.handleError));
  }

  registerSubscriber(subscriber: Partial<Subscriber>): Observable<Subscriber> {
    return this.http.post<Subscriber>(`${this.apiUrl}/subscribers/register`, subscriber)
      .pipe(catchError(this.handleError));
  }

  validateMobile(request: MobileValidationRequest): Observable<Subscriber> {
    return this.http.post<Subscriber>(`${this.apiUrl}/auth/validate-mobile`, request)
      .pipe(catchError(this.handleError));
  }

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/user/plans`)
      .pipe(catchError(this.handleError));
  }

  recharge(request: RechargeRequest): Observable<RechargeResponse> {
    return this.http.post<RechargeResponse>(`${this.apiUrl}/user/recharge`, request, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  getExpiringSubscribers(): Observable<Subscriber[]> {
    return this.http.get<Subscriber[]>(`${this.apiUrl}/admin/subscribers/expiring`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getRechargeHistory(mobileNumber: string): Observable<Recharge[]> {
    return this.http.get<Recharge[]>(`${this.apiUrl}/admin/subscribers/${mobileNumber}/history`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAllPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/admin/plans`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  addPlan(plan: Plan): Observable<Plan> {
    return this.http.post<Plan>(`${this.apiUrl}/admin/plans`, plan, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updatePlan(id: number, plan: Plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.apiUrl}/admin/plans/${id}`, plan, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/plans/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}