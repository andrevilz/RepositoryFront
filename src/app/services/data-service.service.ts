import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api/data'; // URL base do backend
  private apiUrlUser = 'http://localhost:3000/api/users'; // URL base do backend

  constructor(private http: HttpClient) {}

  // Adiciona um novo relatório
  addReport(reportData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, reportData);
  }

  // Obtém dados semanais
  getWeeklyData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/weekly`);
  }

  // Obtém todos os relatórios
  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports/all`);
  }

  // Filtra relatórios por nome de usuário
  getReportsByUser(userName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports/user?userName=${userName}`);
  }

  // Filtra relatórios por intervalo de datas
  getReportsByDateRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/reports/dateRange?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getReportsByUserAndDateRange(
    userName: string,
    startDate: string,
    endDate: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/reports/userAndDateRange?userName=${userName}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlUser}/users`);
  }
}
