import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Part {
  id: number;
  name: string;
  category: string;
  stock: number;
  status: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class PartsService {
  private apiUrl = 'http://localhost:3000/api/parts';

  constructor(private http: HttpClient) {}

  getParts(): Observable<Part[]> {
    return this.http.get<Part[]>(this.apiUrl);
  }

  getPart(id: number): Observable<Part> {
    return this.http.get<Part>(`${this.apiUrl}/${id}`);
  }

  addPart(part: Partial<Part>): Observable<Part> {
    return this.http.post<Part>(this.apiUrl, part);
  }

  updatePart(id: number, part: Partial<Part>): Observable<Part> {
    return this.http.put<Part>(`${this.apiUrl}/${id}`, part);
  }

  deletePart(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
