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
  selectedTab: string = 'inspecionar'; 
  public chartOptions: any; 
  reports: any[] = []; 
  users: any[] = [];
  filters = {
    userName: '',
    startDate: '',
    endDate: '',
  }; 
  filtersGraph = {
    userName: '',
    startDate: '',
    endDate: '',
    month: 'Todos',
  }; 
  months: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro', 'Todos'
  ]; 
  errorMessage: string = '';
  lineChartOptions: any;

  gaugeChartOptions: any;

  monthlySums: { [key: number]: number } = {};
  dailySales: { [key: number]: { [key: number]: number } } = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getAllReports(); 
    this.getUsers(); 
    this.filterReportsGraph();
    this.generateLineChart(this.monthlySums);
  }

    ngAfterViewChecked() {
    // console.log('Após a verificação da visualização TESTE');
  }

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

  filterReports() {
    if (this.filters.userName && this.filters.startDate && this.filters.endDate) {
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
    if (!this.filtersGraph.userName && this.filtersGraph.month === 'Todos') {
      this.noMonthNoUser();
      return;
    }
  
    if (!this.filtersGraph.userName && this.filtersGraph.month !== 'Todos') {
      this.yesMonthNoUser();
      return;
    }
  
    if (this.filtersGraph.userName && this.filtersGraph.month === 'Todos') {
      this.noMonthYesUser();
      return;
    }
  
    if (this.filtersGraph.userName && this.filtersGraph.month !== 'Todos') {
      this.yesMonthYesUser();
      return;
    }
  }
  
noMonthNoUser() {
  const year = new Date().getFullYear();
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

      this.generateLineChart(monthlySums);
    },
    (error) => {
      console.error('Erro ao obter relatórios por período:', error);
    }
  );
}


yesMonthNoUser() {
  const selectedMonth = this.months.indexOf(this.filtersGraph.month);
  const year = new Date().getFullYear(); 
  const startDate = new Date(year, selectedMonth, 1).toISOString().split('T')[0]; 
  const endDate = new Date(year, selectedMonth + 1, 0).toISOString().split('T')[0];
  
  this.dataService.getReportsByDateRange(startDate, endDate).subscribe(
    (reports: any[]) => {
      const dailyValues: { [key: number]: number } = {};

      reports.forEach((report) => {
        const reportDateParts = report.date.split('/');
        const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
        const reportDate = new Date(formattedDate);

        if (isNaN(reportDate.getTime())) {
          console.warn(`Data inválida no relatório: ${report.date}`);
          return;
        }

        const day = reportDate.getDate();

        const reportValue = parseFloat(report.value);
        if (isNaN(reportValue)) {
          console.warn(`Valor inválido no relatório: ${report.value}`);
          return;
        }

        if (dailyValues[day]) {
          dailyValues[day] += reportValue; 
        } else {
          dailyValues[day] = reportValue;
        }
      });

      // console.log(
      //   `Relatórios de ${this.filtersGraph.month} (de ${startDate} a ${endDate}) para o usuário:`,
      //   dailyValues
      // );

      this.generateLineChart(dailyValues);
    },
    (error) => {
      console.error('Erro ao obter relatórios:', error);
    }
  );
}


noMonthYesUser() {
  this.dataService.getReportsByUser(this.filtersGraph.userName).subscribe(
    (reports: any[]) => {
      const dailySales = reports.reduce((acc: any, report: any) => {
        const reportDateParts = report.date.split('/');
        const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
        const reportDate = new Date(formattedDate);

        if (isNaN(reportDate.getTime())) {
          console.warn(`Data inválida no relatório: ${report.date}`);
          return acc; 
        }

        const month = reportDate.getMonth() + 1;  
        const day = reportDate.getDate();       
        
        if (!acc[month]) {
          acc[month] = {};
        }

        if (acc[month][day]) {
          acc[month][day] += parseFloat(report.value); 
        } else {
          acc[month][day] = parseFloat(report.value);  
        }

        return acc;
      }, {});

      // console.log('Valores diários agrupados por mês e dia:', dailySales);

      const chartLabels: string[] = [];
      const chartValues: number[] = [];

      Object.keys(dailySales).forEach((month: string) => {
        let monthlyTotal = 0;

        const days = dailySales[month];
        Object.keys(days).forEach((day: string) => {
          monthlyTotal += days[day];
        });

        chartLabels.push(`Mês ${month}`);
        chartValues.push(monthlyTotal);
      });

      this.generateLineChart(chartLabels, chartValues); 
    },
    (error) => {
      console.error('Erro ao obter relatórios para o usuário:', error);
    }
  );
}

yesMonthYesUser() {
  const selectedMonthIndex = this.months.indexOf(this.filtersGraph.month);

  if (selectedMonthIndex === -1) {
    console.error(`Mês inválido: ${this.filtersGraph.month}`);
    return;
  }

  const startDate = new Date(new Date().getFullYear(), selectedMonthIndex, 1).toISOString();
  const endDate = new Date(new Date().getFullYear(), selectedMonthIndex + 1, 0).toISOString();

  this.dataService.getReportsByUserAndDateRange(this.filtersGraph.userName, startDate, endDate).subscribe(
    (reports: any[]) => {
      const dailySales = reports.reduce((acc: any, report: any) => {
        const reportDateParts = report.date.split('/');
        const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
        const reportDate = new Date(formattedDate);

        if (isNaN(reportDate.getTime())) {
          console.warn(`Data inválida no relatório: ${report.date}`);
          return acc;
        }

        const day = new Date(reportDate).getDate();
        acc[day] = (acc[day] || 0) + parseFloat(report.value);
        return acc;
      }, {});

      const labels = Object.keys(dailySales).map(day => `Dia ${day}`);
      const values: number[] = Object.values(dailySales).map(value => Number(value));

      // console.log(
      //   `Com mês "${this.filtersGraph.month}" e usuário "${this.filtersGraph.userName}": Valores diários`,
      //   dailySales
      // );

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

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }


  calculateMonthlySums(reports: { date: string, value: string }[]): { [key: number]: number } {
    const monthlySums: { [key: number]: number } = { 
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 
    };
  
    reports.forEach((report) => {
      const reportDateParts = report.date.split('/');
      const formattedDate = `${reportDateParts[2]}-${reportDateParts[1]}-${reportDateParts[0]}`;
      const reportDate = new Date(formattedDate);
      const month = reportDate.getMonth(); 
      const reportValue = parseFloat(report.value);
  
      if (!isNaN(reportValue)) {
        monthlySums[month + 1] += reportValue;
      }
    });
  
    return monthlySums;
  }
  
  

  generateLineChart(dataOrLabels: { [key: number]: number } | string[], values?: number[]) {
    let labels: string[] = [];
    let valuesData: number[] = [];
  
    if (Array.isArray(dataOrLabels)) {
      labels = dataOrLabels;
      valuesData = values || [];
    } else {
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
