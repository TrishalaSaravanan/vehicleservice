import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminStats {
  totalMechanics: {
    value: number;
    trend: 'up' | 'down';
    change: number;
    period: string;
  };
  newBookings: {
    value: number;
    trend: 'up' | 'down';
    change: number;
    period: string;
  };
  todaySchedules: {
    value: number;
    trend: 'up' | 'down';
    change: number;
    period: string;
  };
}

export interface ServiceDistribution {
  labels: string[];
  data: number[];
  percentages: number[];
  total: number;
  colors: string[];
}

export interface ServiceDistributionResponse {
  success: boolean;
  distribution: ServiceDistribution;
}

export interface RevenueByService {
  labels: string[];
  data: number[];
  appointmentCounts: number[];
  total: number;
  colors: string[];
}

export interface RevenueByServiceResponse {
  success: boolean;
  revenue: RevenueByService;
}

export interface WeeklyAppointments {
  labels: string[];
  data: number[];
  weekDates: string[];
  total: number;
}

export interface WeeklyAppointmentsResponse {
  success: boolean;
  appointments: WeeklyAppointments;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) { }

  getAdminStats(): Observable<{ success: boolean; stats: AdminStats }> {
    return this.http.get<{ success: boolean; stats: AdminStats }>(`${this.apiUrl}/stats`, {
      withCredentials: true // Include cookies for authentication
    });
  }

  getServiceDistribution(): Observable<ServiceDistributionResponse> {
    return this.http.get<ServiceDistributionResponse>(`${this.apiUrl}/service-distribution`, {
      withCredentials: true // Include cookies for authentication
    });
  }

  getRevenueByService(): Observable<RevenueByServiceResponse> {
    return this.http.get<RevenueByServiceResponse>(`${this.apiUrl}/revenue-by-service`, {
      withCredentials: true // Include cookies for authentication
    });
  }

  getWeeklyAppointments(): Observable<WeeklyAppointmentsResponse> {
    return this.http.get<WeeklyAppointmentsResponse>(`${this.apiUrl}/weekly-appointments`, {
      withCredentials: true // Include cookies for authentication
    });
  }
}
