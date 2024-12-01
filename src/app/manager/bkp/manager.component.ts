// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../services/data-service.service'; // Serviço para manipulação dos dados
// import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

// @Component({
//   selector: 'app-manager',
//   standalone: false,
//   templateUrl: './manager.component.html',
//   styleUrls: ['./manager.component.scss']
// })
// export class ManagerComponent implements OnInit {

//   selectedTab: string = 'inspecionar'; // Aba inicialmente selecionada

//   reports: any[] = []; // Declaração da propriedade reports
//   users: any[] = []; // Propriedade para armazenar os usuários
//   filters = {
//     userName: '',
//     startDate: '',
//     endDate: '',
//   }; // Declaração da propriedade filters
//   filtersGraph = {
//     userName: '',
//     startDate: '',
//     endDate: '',
//     month: 'Todos', // Filtro de mês (padrão é "Todos")
//   }; // Declaração da propriedade filters
//   months: string[] = [
//     'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
//     'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Todos'
//   ]; // Propriedade para armazenar os meses
//   errorMessage: string = ''; // Declaração da propriedade errorMessage
//   // Opções para o gráfico de linha
//   lineChartOptions: any;

//   // Opções para o gráfico gauge
//   gaugeChartOptions: any;

//   constructor(private dataService: DataService) {}

//   ngOnInit() {
//     this.getAllReports(); // Obtém todos os relatórios ao iniciar
//     this.getUsers(); // Carrega a lista de usuários
//     this.filterReportsGraph();
//   }

//   // Obter todos os relatórios
//   getAllReports() {
//     this.dataService.getAllReports().subscribe(
//       (data: any) => {
//         this.reports = data;
//         this.errorMessage = '';
//       },
//       (error) => {
//         this.errorMessage = 'Erro ao carregar relatórios.';
//         console.error(error);
//       }
//     );
//   }

//   // Obter lista de usuários (filtro por acesso de supervisor)
//   getUsers() {
//     this.dataService.getUsers().subscribe(
//       (data: any) => {
//         this.users = data;
//       },
//       (error) => {
//         this.errorMessage = 'Erro ao carregar usuários.';
//         console.error(error);
//       }
//     );
//   }

//   // Filtrar relatórios
//   filterReports() {
//     if (this.filters.userName && this.filters.startDate && this.filters.endDate) {
//       // Filtrar por nome e intervalo de datas simultaneamente
//       this.dataService
//         .getReportsByUserAndDateRange(
//           this.filters.userName,
//           this.filters.startDate,
//           this.filters.endDate
//         )
//         .subscribe(
//           (data: any) => {
//             this.reports = data;
//             this.errorMessage = '';
//           },
//           (error) => {
//             this.errorMessage = `Erro ao buscar relatórios para o usuário "${this.filters.userName}" e o período especificado.`;
//             console.error(error);
//           }
//         );
//     } else if (this.filters.userName) {
//       // Filtrar apenas por nome
//       this.dataService.getReportsByUser(this.filters.userName).subscribe(
//         (data: any) => {
//           this.reports = data;
//           this.errorMessage = '';
//         },
//         (error) => {
//           this.errorMessage = `Erro ao buscar relatórios para o usuário: ${this.filters.userName}`;
//           console.error(error);
//         }
//       );
//     } else if (this.filters.startDate && this.filters.endDate) {
//       // Filtrar apenas por intervalo de datas
//       this.dataService
//         .getReportsByDateRange(this.filters.startDate, this.filters.endDate)
//         .subscribe(
//           (data: any) => {
//             this.reports = data;
//             this.errorMessage = '';
//           },
//           (error) => {
//             this.errorMessage = 'Erro ao buscar relatórios por data.';
//             console.error(error);
//           }
//         );
//     } else {
//       this.getAllReports();
//     }
//   }

//   filterReportsGraph() {
//     // Sem usuário e sem mês
//     if (!this.filtersGraph.userName && this.filtersGraph.month === 'Todos') {
//       this.noMonthNoUser();
//       return;
//     }
  
//     // Com mês e sem usuário
//     if (!this.filtersGraph.userName && this.filtersGraph.month !== 'Todos') {
//       this.yesMonthNoUser();
//       return;
//     }
  
//     // Com usuário e sem mês
//     if (this.filtersGraph.userName && this.filtersGraph.month === 'Todos') {
//       this.noMonthYesUser();
//       return;
//     }
  
//     // Com mês e com usuário
//     if (this.filtersGraph.userName && this.filtersGraph.month !== 'Todos') {
//       this.yesMonthYesUser();
//       return;
//     }
//   }
  
// // Sem usuário e sem mês: Soma total por mês
// noMonthNoUser() {
//   const year = new Date().getFullYear(); // Ano atual

//   // Criar um objeto para armazenar a soma dos valores de cada mês, com todos os meses iniciando em 0
//   const monthlySums: { [key: number]: number } = {
//     1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0
//   };

//   // Obter todos os relatórios do ano
//   this.dataService.getReportsByDateRange(`${year}-01-01`, `${year}-12-31`).subscribe(
//     (reports: any[]) => {
//       reports.forEach((report) => {
//         // Converter a data no formato dd/MM/yyyy para yyyy-MM-dd
//         const reportDateParts = report.date.split('/');
//         const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
//         const reportDate = new Date(formattedDate);

//         // Verificar se a data do relatório é válida
//         if (isNaN(reportDate.getTime())) {
//           console.warn(`Data inválida no relatório: ${report.date}`);
//           return; // Pula este relatório caso a data seja inválida
//         }

//         // Obtém o mês da data (0 a 11)
//         const month = reportDate.getMonth(); // Janeiro = 0, Fevereiro = 1, etc.

//         // Verificar se o valor do relatório é numérico
//         const reportValue = parseFloat(report.value);
//         if (isNaN(reportValue)) {
//           console.warn(`Valor inválido no relatório: ${report.value}`);
//           return; // Pula este relatório caso o valor não seja válido
//         }

//         // Soma o valor do relatório ao mês correspondente
//         monthlySums[month + 1] += reportValue;
//       });

//       // Exibe no console as somas totais por mês
//       console.log('Soma total por mês:', monthlySums);
//     },
//     (error) => {
//       console.error('Erro ao obter relatórios por período:', error);
//     }
//   );
// }

// // Com mês e sem usuário: Soma total por mês
// yesMonthNoUser() {
//   // Calcula o intervalo de datas baseado no mês selecionado
//   const selectedMonth = this.months.indexOf(this.filtersGraph.month);
//   const year = new Date().getFullYear(); // Ano atual
//   const startDate = new Date(year, selectedMonth, 1).toISOString().split('T')[0]; // Primeiro dia do mês
//   const endDate = new Date(year, selectedMonth + 1, 0).toISOString().split('T')[0]; // Último dia do mês
  
//   // Chama o serviço para buscar os relatórios no intervalo de datas
//   this.dataService.getReportsByDateRange(startDate, endDate).subscribe(
//     (reports: any[]) => {
//       // Cria um array com as datas e valores dos relatórios
//       const detailedReports = reports.map((report) => {
//         // Converter a data no formato dd/MM/yyyy para yyyy-MM-dd
//         const reportDateParts = report.date.split('/');
//         const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
//         const reportDate = new Date(formattedDate);

//         // Verificar se a data do relatório é válida
//         if (isNaN(reportDate.getTime())) {
//           console.warn(`Data inválida no relatório: ${report.date}`);
//           return null; // Pula este relatório caso a data seja inválida
//         }

//         return {
//           date: reportDate.toISOString().split('T')[0], // Data do relatório
//           value: report.value // Valor do relatório
//         };
//       }).filter(report => report !== null); // Filtra relatórios inválidos

//       // Exibe no console o array detalhado de relatórios
//       console.log(
//         `Relatórios de ${this.filtersGraph.month} (de ${startDate} a ${endDate}) para o usuário:`,
//         detailedReports
//       );
//     },
//     (error) => {
//       console.error('Erro ao obter relatórios:', error);
//     }
//   );
// }

// // Com usuário e sem mês: Soma total por mês
// noMonthYesUser() {
//   this.dataService.getReportsByUser(this.filtersGraph.userName).subscribe(
//     (reports: any[]) => {
//       // Criando um objeto para armazenar as vendas diárias
//       const dailySales = reports.reduce((acc: any, report: any) => {
//         // Converter a data no formato dd/MM/yyyy para yyyy-MM-dd
//         const reportDateParts = report.date.split('/');
//         const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
//         const reportDate = new Date(formattedDate);

//         // Verificar se a data do relatório é válida
//         if (isNaN(reportDate.getTime())) {
//           console.warn(`Data inválida no relatório: ${report.date}`);
//           return acc; // Pula este relatório caso a data seja inválida
//         }

//         const month = reportDate.getMonth() + 1;  // Obtém o mês (1-12)
//         const day = reportDate.getDate();         // Obtém o dia (1-31)
        
//         // Verifica se o mês já existe no objeto
//         if (!acc[month]) {
//           acc[month] = {}; // Cria o objeto para o mês
//         }

//         // Soma os valores para o dia
//         if (acc[month][day]) {
//           acc[month][day] += parseFloat(report.value);  // Soma os valores diários
//         } else {
//           acc[month][day] = parseFloat(report.value);  // Inicializa o valor para o dia
//         }

//         return acc;
//       }, {});

//       // Exibindo os valores diários agrupados por mês
//       console.log('Valores diários agrupados por mês e dia:', dailySales);
//     },
//     (error) => {
//       console.error('Erro ao obter relatórios para o usuário:', error);
//     }
//   );
// }

// // Com mês e com usuário: Valores diários por mês e usuário
// yesMonthYesUser() {
//   // Determina o índice do mês selecionado
//   const selectedMonthIndex = this.months.indexOf(this.filtersGraph.month);

//   // Verifica se o índice do mês é válido
//   if (selectedMonthIndex === -1) {
//     console.error(`Mês inválido: ${this.filtersGraph.month}`);
//     return;
//   }

//   // Define o intervalo de datas com base no mês selecionado
//   const startDate = new Date(new Date().getFullYear(), selectedMonthIndex, 1).toISOString();
//   const endDate = new Date(new Date().getFullYear(), selectedMonthIndex + 1, 0).toISOString();

//   // Obtém relatórios filtrados por usuário e intervalo de datas
//   this.dataService.getReportsByUserAndDateRange(this.filtersGraph.userName, startDate, endDate).subscribe(
//     (reports: any[]) => {
//       // Calcula os valores diários para o mês selecionado
//       const dailySales = reports.reduce((acc: any, report: any) => {
//         // Converter a data no formato dd/MM/yyyy para yyyy-MM-dd
//         const reportDateParts = report.date.split('/');
//         const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
//         const reportDate = new Date(formattedDate);

//         // Verificar se a data do relatório é válida
//         if (isNaN(reportDate.getTime())) {
//           console.warn(`Data inválida no relatório: ${report.date}`);
//           return acc; // Pula este relatório caso a data seja inválida
//         }

//         const day = new Date(reportDate).getDate(); // Obtém o dia do relatório
//         acc[day] = (acc[day] || 0) + parseFloat(report.value); // Soma os valores corretamente
//         return acc;
//       }, {});

//       // Exibe os valores diários no console
//       console.log(
//         `Com mês "${this.filtersGraph.month}" e usuário "${this.filtersGraph.userName}": Valores diários`,
//         dailySales
//       );
//     },
//     (error) => {
//       console.error(
//         `Erro ao obter relatórios para o usuário "${this.filtersGraph.userName}" no mês "${this.filtersGraph.month}":`,
//         error
//       );
//     }
//   );
// }




  





//   // Selecionar a aba
//   selectTab(tabName: string) {
//     this.selectedTab = tabName;
//   }
// }
