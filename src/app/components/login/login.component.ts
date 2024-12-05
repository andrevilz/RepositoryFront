import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
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
    const user = localStorage.getItem('user');
    if (user) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.authService.login(this.loginData.name, this.loginData.password)
      .subscribe(
        (response) => {
          // console.log('Login bem-sucedido', response);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.loginError = error.error.message || 'Erro ao realizar login';
        }
      );
  }
  onRegister() {
    this.authService.register(this.registerData.name, this.registerData.password, this.registerData.access)
      .subscribe(
        (response) => {
          alert('Cadastro bem-sucedido!');
          this.currentTab = 'login';
        },
        (error) => {
          this.registerError = error.error.message || 'Erro ao realizar cadastro';
        }
      );
  }
}