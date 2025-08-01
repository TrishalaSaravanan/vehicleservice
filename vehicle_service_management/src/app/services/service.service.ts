import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

@Injectable({ providedIn: 'root' })
export class ServiceService {
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  private apiUrl = '/api/services';

  constructor(private http: HttpClient) {}


  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  addService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  updateService(id: number, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${id}`, service);
  }
}
