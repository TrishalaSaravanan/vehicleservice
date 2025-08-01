import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerReport {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  total_appointments: number;
  total_spent: number;
  last_appointment_date: string;
  vehicle_count: number;
  registration_date: string;
  status: string;
}

export interface MechanicReport {
  name: string;
  email: string;
  phone: string;
  experience: number;
  specializations: string;
  certifications: string;
  join_date: string;
  status: string;
}

export interface CustomerReportResponse {
  success: boolean;
  customers: CustomerReport[];
  total: number;
}

export interface MechanicReportResponse {
  success: boolean;
  mechanics: MechanicReport[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/api/reports';

  constructor(private http: HttpClient) { }

  getCustomerReport(): Observable<CustomerReportResponse> {
    return this.http.get<CustomerReportResponse>(`${this.apiUrl}/customers`, {
      withCredentials: true
    });
  }

  getMechanicReport(): Observable<MechanicReportResponse> {
    return this.http.get<MechanicReportResponse>(`${this.apiUrl}/mechanics`, {
      withCredentials: true
    });
  }

  exportCustomerReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers/export`, {
      withCredentials: true
    });
  }

  exportMechanicReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mechanics/export`, {
      withCredentials: true
    });
  }
}
