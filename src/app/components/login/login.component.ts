import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Importando o serviço
import { Router } from '@angular/router';  // Importando Router

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  currentTab: string = 'login';
  loginData = { name: '', password: '' };
  registerData = { name: '', password: '', access: 0 };
  loginError: string = '';
  registerError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Verificar se já há um usuário autenticado
    const user = localStorage.getItem('user');
    if (user) {
      // Se já estiver autenticado, redireciona para o dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  // Método para login
  onLogin() {
    this.authService.login(this.loginData.name, this.loginData.password)
      .subscribe(
        (response) => {
          console.log('Login bem-sucedido', response);
          // Armazenar o nome do usuário no localStorage ou em um cookie, conforme necessário
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Redirecionar para o dashboard após login
          this.router.navigate(['/dashboard']);  // Navegar para a página de Dashboard
        },
        (error) => {
          this.loginError = error.error.message || 'Erro ao realizar login';
        }
      );
  }
  // Método para cadastro
  onRegister() {
    this.authService.register(this.registerData.name, this.registerData.password, this.registerData.access)
      .subscribe(
        (response) => {
          alert('Cadastro bem-sucedido!'); // Exibe o alerta
          this.currentTab = 'login'; // Muda para a aba de login
        },
        (error) => {
          this.registerError = error.error.message || 'Erro ao realizar cadastro';
        }
      );
  }
}