
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MechanicPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  experience?: number;
  certifications?: string[];
  specializations?: string[];
}

@Injectable({ providedIn: 'root' })
export class MechanicService {
  private apiUrl = 'http://localhost:3000/api/mechanics';

  constructor(private http: HttpClient) {}

  addMechanic(mechanic: MechanicPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, mechanic);
  }

  getAllMechanics(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateMechanic(id: string, mechanic: Partial<MechanicPayload>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, mechanic);
  }

  deleteMechanic(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
