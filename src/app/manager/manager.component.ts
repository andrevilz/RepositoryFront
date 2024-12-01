import { Component, OnInit, AfterViewChecked, ViewChild   } from '@angular/core';
import { DataService } from '../services/data-service.service'; // Serviço para manipulação dos dados
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-manager',
  standalone: false,
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit, AfterViewChecked  {
  @ViewChild("chart") chart: ChartComponent | undefined;
  selectedTab: string = 'inspecionar'; // Aba inicialmente selecionada
  public chartOptions: any; // Renomeando para 'chartOptions'
  reports: any[] = []; // Declaração da propriedade reports
  users: any[] = []; // Propriedade para armazenar os usuários
  filters = {
    userName: '',
    startDate: '',
    endDate: '',
  }; // Declaração da propriedade filters
  filtersGraph = {
    userName: '',
    startDate: '',
    endDate: '',
    month: 'Todos', // Filtro de mês (padrão é "Todos")
  }; // Declaração da propriedade filters
  months: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Todos'
  ]; // Propriedade para armazenar os meses
  errorMessage: string = ''; // Declaração da propriedade errorMessage
  // Opções para o gráfico de linha
  lineChartOptions: any;

  // Opções para o gráfico gauge
  gaugeChartOptions: any;

  monthlySums: { [key: number]: number } = {};
  dailySales: { [key: number]: { [key: number]: number } } = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getAllReports(); // Obtém todos os relatórios ao iniciar
    this.getUsers(); // Carrega a lista de usuários
    this.filterReportsGraph();
    this.generateLineChart(this.monthlySums);
  }

    ngAfterViewChecked() {
    // Isso é chamado após a verificação da visualização
    console.log('Após a verificação da visualização');
    // Você pode colocar lógica aqui que precisa ser executada após a verificação das alterações na visualização.
    // Exemplo: atualizar ou redibujar o gráfico
  }

  // Obter todos os relatórios
  getAllReports() {
    this.dataService.getAllReports().subscribe(
      (data: any) => {
        this.reports = data;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Erro ao carregar relatórios.';
        console.error(error);
      }
    );
  }

  // Obter lista de usuários (filtro por acesso de supervisor)
  getUsers() {
    this.dataService.getUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error) => {
        this.errorMessage = 'Erro ao carregar usuários.';
        console.error(error);
      }
    );
  }

  // Filtrar relatórios
  filterReports() {
    if (this.filters.userName && this.filters.startDate && this.filters.endDate) {
      // Filtrar por nome e intervalo de datas simultaneamente
      this.dataService
        .getReportsByUserAndDateRange(
          this.filters.userName,
          this.filters.startDate,
          this.filters.endDate
        )
        .subscribe(
          (data: any) => {
            this.reports = data;
            this.errorMessage = '';
          },
          (error) => {
            this.errorMessage = `Erro ao buscar relatórios para o usuário "${this.filters.userName}" e o período especificado.`;
            console.error(error);
          }
        );
    } else if (this.filters.userName) {
      // Filtrar apenas por nome
      this.dataService.getReportsByUser(this.filters.userName).subscribe(
        (data: any) => {
          this.reports = data;
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = `Erro ao buscar relatórios para o usuário: ${this.filters.userName}`;
          console.error(error);
        }
      );
    } else if (this.filters.startDate && this.filters.endDate) {
      // Filtrar apenas por intervalo de datas
      this.dataService
        .getReportsByDateRange(this.filters.startDate, this.filters.endDate)
        .subscribe(
          (data: any) => {
            this.reports = data;
            this.errorMessage = '';
          },
          (error) => {
            this.errorMessage = 'Erro ao buscar relatórios por data.';
            console.error(error);
          }
        );
    } else {
      this.getAllReports();
    }
  }

  filterReportsGraph() {
    // Sem usuário e sem mês
    if (!this.filtersGraph.userName && this.filtersGraph.month === 'Todos') {
      this.noMonthNoUser();
      return;
    }
  
    // Com mês e sem usuário
    if (!this.filtersGraph.userName && this.filtersGraph.month !== 'Todos') {
      this.yesMonthNoUser();
      return;
    }
  
    // Com usuário e sem mês
    if (this.filtersGraph.userName && this.filtersGraph.month === 'Todos') {
      this.noMonthYesUser();
      return;
    }
  
    // Com mês e com usuário
    if (this.filtersGraph.userName && this.filtersGraph.month !== 'Todos') {
      this.yesMonthYesUser();
      return;
    }
  }
  
// Sem usuário e sem mês: Soma total por mês
noMonthNoUser() {
  const year = new Date().getFullYear(); // Ano atual
  const monthlySums: { [key: number]: number } = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0
  };

  this.dataService.getReportsByDateRange(`${year}-01-01`, `${year}-12-31`).subscribe(
    (reports: any[]) => {
      reports.forEach((report) => {
        const reportDateParts = report.date.split('/');
        const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
        const reportDate = new Date(formattedDate);

        if (isNaN(reportDate.getTime())) {
          console.warn(`Data inválida no relatório: ${report.date}`);
          return;
        }

        const month = reportDate.getMonth();
        const reportValue = parseFloat(report.value);
        if (isNaN(reportValue)) {
          console.warn(`Valor inválido no relatório: ${report.value}`);
          return;
        }

        monthlySums[month + 1] += reportValue;
      });

      // Passa os dados para a função generateLineChart
      this.generateLineChart(monthlySums);
    },
    (error) => {
      console.error('Erro ao obter relatórios por período:', error);
    }
  );
}


// Com mês e sem usuário: Soma total por mês
yesMonthNoUser() {
  // Calcula o intervalo de datas baseado no mês selecionado
  const selectedMonth = this.months.indexOf(this.filtersGraph.month);
  const year = new Date().getFullYear(); // Ano atual
  const startDate = new Date(year, selectedMonth, 1).toISOString().split('T')[0]; // Primeiro dia do mês
  const endDate = new Date(year, selectedMonth + 1, 0).toISOString().split('T')[0]; // Último dia do mês
  
  // Chama o serviço para buscar os relatórios no intervalo de datas
  this.dataService.getReportsByDateRange(startDate, endDate).subscribe(
    (reports: any[]) => {
      // Criar um objeto para armazenar os valores por dia
      const dailyValues: { [key: number]: number } = {};

      // Processar os relatórios e somar os valores por dia
      reports.forEach((report) => {
        // Converter a data no formato dd/MM/yyyy para yyyy-MM-dd
        const reportDateParts = report.date.split('/');
        const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
        const reportDate = new Date(formattedDate);

        // Verificar se a data do relatório é válida
        if (isNaN(reportDate.getTime())) {
          console.warn(`Data inválida no relatório: ${report.date}`);
          return;
        }

        // Obter o dia da data
        const day = reportDate.getDate();

        // Verificar se o valor do relatório é numérico
        const reportValue = parseFloat(report.value);
        if (isNaN(reportValue)) {
          console.warn(`Valor inválido no relatório: ${report.value}`);
          return;
        }

        // Somar o valor ao dia correspondente
        if (dailyValues[day]) {
          dailyValues[day] += reportValue; // Se já existe o valor para o dia, soma
        } else {
          dailyValues[day] = reportValue; // Caso contrário, inicializa o valor para o dia
        }
      });

      // Exibe os dados de valores diários no console
      console.log(
        `Relatórios de ${this.filtersGraph.month} (de ${startDate} a ${endDate}) para o usuário:`,
        dailyValues
      );

      // Passa os dados para a função generateLineChart
      this.generateLineChart(dailyValues);
    },
    (error) => {
      console.error('Erro ao obter relatórios:', error);
    }
  );
}


// Com usuário e sem mês: Soma total por mês
noMonthYesUser() {
  this.dataService.getReportsByUser(this.filtersGraph.userName).subscribe(
    (reports: any[]) => {
      // Criando um objeto para armazenar as vendas diárias
      const dailySales = reports.reduce((acc: any, report: any) => {
        // Converter a data no formato dd/MM/yyyy para yyyy-MM-dd
        const reportDateParts = report.date.split('/');
        const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
        const reportDate = new Date(formattedDate);

        // Verificar se a data do relatório é válida
        if (isNaN(reportDate.getTime())) {
          console.warn(`Data inválida no relatório: ${report.date}`);
          return acc; // Pula este relatório caso a data seja inválida
        }

        const month = reportDate.getMonth() + 1;  // Obtém o mês (1-12)
        const day = reportDate.getDate();         // Obtém o dia (1-31)
        
        // Verifica se o mês já existe no objeto
        if (!acc[month]) {
          acc[month] = {}; // Cria o objeto para o mês
        }

        // Soma os valores para o dia
        if (acc[month][day]) {
          acc[month][day] += parseFloat(report.value);  // Soma os valores diários
        } else {
          acc[month][day] = parseFloat(report.value);  // Inicializa o valor para o dia
        }

        return acc;
      }, {});

      // Exibindo os valores diários agrupados por mês e dia
      console.log('Valores diários agrupados por mês e dia:', dailySales);

      // Preparando os dados para o gráfico
      const chartLabels: string[] = [];
      const chartValues: number[] = [];

      // Para cada mês, vamos somar os valores diários e adicionar ao gráfico
      Object.keys(dailySales).forEach((month: string) => {
        let monthlyTotal = 0;

        // Somando os valores diários dentro do mês
        const days = dailySales[month];
        Object.keys(days).forEach((day: string) => {
          monthlyTotal += days[day];
        });

        // Adicionando os dados ao gráfico
        chartLabels.push(`Mês ${month}`);
        chartValues.push(monthlyTotal);
      });

      // Gerando o gráfico com os dados preparados
      this.generateLineChart(chartLabels, chartValues); // Chama a função para gerar o gráfico com os dados
    },
    (error) => {
      console.error('Erro ao obter relatórios para o usuário:', error);
    }
  );
}

// Com mês e com usuário: Valores diários por mês e usuário
yesMonthYesUser() {
  // Determina o índice do mês selecionado
  const selectedMonthIndex = this.months.indexOf(this.filtersGraph.month);

  // Verifica se o índice do mês é válido
  if (selectedMonthIndex === -1) {
    console.error(`Mês inválido: ${this.filtersGraph.month}`);
    return;
  }

  // Define o intervalo de datas com base no mês selecionado
  const startDate = new Date(new Date().getFullYear(), selectedMonthIndex, 1).toISOString();
  const endDate = new Date(new Date().getFullYear(), selectedMonthIndex + 1, 0).toISOString();

  // Obtém relatórios filtrados por usuário e intervalo de datas
  this.dataService.getReportsByUserAndDateRange(this.filtersGraph.userName, startDate, endDate).subscribe(
    (reports: any[]) => {
      // Calcula os valores diários para o mês selecionado
      const dailySales = reports.reduce((acc: any, report: any) => {
        // Converter a data no formato dd/MM/yyyy para yyyy-MM-dd
        const reportDateParts = report.date.split('/');
        const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
        const reportDate = new Date(formattedDate);

        // Verificar se a data do relatório é válida
        if (isNaN(reportDate.getTime())) {
          console.warn(`Data inválida no relatório: ${report.date}`);
          return acc; // Pula este relatório caso a data seja inválida
        }

        const day = new Date(reportDate).getDate(); // Obtém o dia do relatório
        acc[day] = (acc[day] || 0) + parseFloat(report.value); // Soma os valores corretamente
        return acc;
      }, {});

      // Preparando os dados para o gráfico
      const labels = Object.keys(dailySales).map(day => `Dia ${day}`);
      // Garantindo que 'values' seja do tipo 'number[]' usando 'Object.values' com cast
      const values: number[] = Object.values(dailySales).map(value => Number(value));

      // Exibe os valores diários no console
      console.log(
        `Com mês "${this.filtersGraph.month}" e usuário "${this.filtersGraph.userName}": Valores diários`,
        dailySales
      );

      // Chama o método para gerar o gráfico
      this.generateLineChart(labels, values);
    },
    (error) => {
      console.error(
        `Erro ao obter relatórios para o usuário "${this.filtersGraph.userName}" no mês "${this.filtersGraph.month}":`,
        error
      );
    }
  );
}

  // Selecionar a aba
  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }


  calculateMonthlySums(reports: { date: string, value: string }[]): { [key: number]: number } {
    // Tipagem ajustada para aceitar qualquer número de 1 a 12
    const monthlySums: { [key: number]: number } = { 
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 
    };
  
    reports.forEach((report) => {
      const reportDateParts = report.date.split('/');
      const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
      const reportDate = new Date(formattedDate);
      const month = reportDate.getMonth(); // Janeiro = 0, Fevereiro = 1, etc.
      const reportValue = parseFloat(report.value);
  
      if (!isNaN(reportValue)) {
        // Como month é de 0 a 11, somamos 1 para ajustar para 1 a 12
        monthlySums[month + 1] += reportValue;
      }
    });
  
    return monthlySums;
  }
  
  

  // Exemplo de função para gerar o gráfico
  generateLineChart(dataOrLabels: { [key: number]: number } | string[], values?: number[]) {
    let labels: string[] = [];
    let valuesData: number[] = [];
  
    // Verifica se foi passado um único argumento com os dados
    if (Array.isArray(dataOrLabels)) {
      // Se for um array, assumimos que são os labels e os valores são passados separadamente
      labels = dataOrLabels;
      valuesData = values || [];
    } else {
      // Se for um objeto, assume-se que dataOrLabels são os dados e precisa-se extrair as labels e valores
      labels = Object.keys(dataOrLabels).map(month => `${month}`);
      valuesData = Object.values(dataOrLabels);
    }
  
    this.chartOptions = {
      series: [
        {
          name: "Valor Total por Mês",
          data: valuesData
        }
      ],
      chart: {
        type: "line",
        height: 350,
        width: 700
      },
      xaxis: {
        categories: labels
      },
      yaxis: {
        title: {
          text: 'Valor'
        }
      }
    };
  }
  

  
  
}
