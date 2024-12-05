import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Para redirecionar o usuário

@Component({
  selector: 'app-dashboard',
  standalone: false,
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: any;
  access: number = 0;

  data = { name: '', value: 0 };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.access = this.user.access;
    }
  }


  isSupervisor(): boolean {
    return this.access === 0;
  }


  isManager(): boolean {
    return this.access === 1;
  }

  logout() {

    localStorage.clear();
    sessionStorage.clear();


    this.router.navigate(['/login']);
  }
}