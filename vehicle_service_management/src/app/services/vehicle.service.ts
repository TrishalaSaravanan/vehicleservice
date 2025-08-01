import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private apiUrl = '/api/vehicles';

  constructor(private http: HttpClient) {}

  addVehicle(vehicle: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, vehicle);
  }

  getVehiclesByCustomer(customer_id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customer/${customer_id}`);
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
