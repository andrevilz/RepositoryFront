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

  addReport(reportData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, reportData);
  }

  getWeeklyData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/weekly`);
  }

  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports/all`);
  }

  getReportsByUser(userName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports/user?userName=${userName}`);
  }

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
