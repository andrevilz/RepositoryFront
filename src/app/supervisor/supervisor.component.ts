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
    // console.log('iniciado')
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.reportData.name = parsedUser.name; 

    }
  }

  onAddReport() {
    this.dataService.addReport(this.reportData)
      .subscribe(
        (response) => {
          alert('Cadastro de relatório realizado com sucesso!'); 
          // console.log('Relatório adicionado com sucesso', response);
          const user = localStorage.getItem('user');
          if (user) {
            const parsedUser = JSON.parse(user); 
            this.reportData.name = parsedUser.name; 
                this.reportData = {
                  name: parsedUser.name,
                  value: '',
                  codigoFiscal: ''
                }; 
          }

        },
        (error) => {
          this.addReportError = error.error.message || 'Erro ao adicionar relatório';
        }
      );
  }
  
}