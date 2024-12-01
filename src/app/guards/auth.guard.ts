import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Verifica se o usuário está autenticado (presença de 'user' no localStorage)
    const user = localStorage.getItem('user');

    if (user) {
      // Se o usuário estiver logado, permite o acesso à página
      return true;
    }

    // Caso contrário, redireciona para a página de login
    this.router.navigate(['/']);  // Redireciona para a página de login
    return false;  // Impede o acesso à página
  }
}
