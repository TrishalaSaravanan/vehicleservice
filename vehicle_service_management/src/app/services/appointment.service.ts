import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = '/api/appointments';

  constructor(private http: HttpClient) {}

  // Book a new appointment
  bookAppointment(appointment: any): Observable<any> {
    return this.http.post(this.apiUrl, appointment);
  }

  // Get appointments for a customer
  getAppointmentsByCustomer(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?customerId=${customerId}`);
  }

  // Get all appointments (admin view)
  getAllAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Update appointment status (accept/reject/assign)
  updateAppointmentStatus(id: number, status: string, mechanic_id?: string): Observable<any> {
    const body: any = { status };
    if (mechanic_id) body.mechanic_id = mechanic_id;
    return this.http.patch(`${this.apiUrl}/${id}/status`, body);
  }

  // Get appointments for a mechanic
  getAppointmentsByMechanic(mechanicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?mechanicId=${mechanicId}`);
  }
}
