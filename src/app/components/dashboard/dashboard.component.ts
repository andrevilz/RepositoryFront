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
  access: number = 0;  // Acesso do usuário (0 - Supervisor, 1 - Gerente)

  // Dados para o formulário de adicionar dados (exemplo)
  data = { name: '', value: 0 };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.access = this.user.access;  // Obtendo o tipo de acesso do usuário
    }
  }

  // Método para verificar se o usuário é Supervisor
  isSupervisor(): boolean {
    return this.access === 0;
  }

  // Método para verificar se o usuário é Gerente
  isManager(): boolean {
    return this.access === 1;
  }

  logout() {
    // Limpar o armazenamento local (ou qualquer dado de sessão)
    localStorage.clear();
    sessionStorage.clear();

    // Redirecionar para a página de login
    this.router.navigate(['/login']);
  }
}