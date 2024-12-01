import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000'; // Altere se necessário

  constructor(private http: HttpClient) {}

  // Exemplo: Login
  login(credentials: { name: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, credentials);
  }

  // Outros métodos podem ser adicionados aqui
}
