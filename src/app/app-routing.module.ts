import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';  // Importando o guard

const routes: Routes = [
  { path: '', component: LoginComponent }, // Página de login
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protegendo a página de dashboard
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirecionamento para login em caso de rota inválida
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
