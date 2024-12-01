import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Importando Router
import { DataService } from '../services/data-service.service'; // Serviço para manipulação dos dados

@Component({
  selector: 'app-supervisor',
  standalone: false,
  
  templateUrl: './supervisor.component.html',
  styleUrl: './supervisor.component.scss'
})
export class SupervisorComponent implements OnInit {
  reportData = { name: '', value: '', codigoFiscal: '' };
  addReportError: string = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    console.log('iniciado')
    // Tentar obter o nome do usuário armazenado no localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user); // Parse do user armazenado
      this.reportData.name = parsedUser.name; // Definindo o nome do relatório como o nome do usuário

    }
  }

  onAddReport() {
    this.dataService.addReport(this.reportData)
      .subscribe(
        (response) => {
          alert('Cadastro de relatório realizado com sucesso!'); // Exibe o alerta
          console.log('Relatório adicionado com sucesso', response);
          const user = localStorage.getItem('user');
          if (user) {
            const parsedUser = JSON.parse(user); // Parse do user armazenado
            this.reportData.name = parsedUser.name; // Definindo o nome do relatório como o nome do usuário
                // Limpa os campos após o cadastro
                this.reportData = {
                  name: parsedUser.name,
                  value: '',
                  codigoFiscal: ''
                }; // Definindo os campos para valores vazios
          }

        },
        (error) => {
          this.addReportError = error.error.message || 'Erro ao adicionar relatório';
        }
      );
  }
  
}