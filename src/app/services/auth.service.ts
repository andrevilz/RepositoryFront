import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';  

  constructor(private http: HttpClient) {}

  login(name: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { name, password });
  }

  register(name: string, password: string, access: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, { name, password, access });
  }
}