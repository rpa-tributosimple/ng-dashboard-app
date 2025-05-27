import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-chart',
  imports: [CommonModule, HttpClientModule, NgxChartsModule, ButtonModule],
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css']
})
export class ChartComponent implements OnInit {

  private baseUrl = environment.baseUrl;

  chartData: any[] = [];
  colorScheme = 'vivid';

  monthOffset = 0;
  currentMonthName = '';
  monthTitle: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadChartData();
  }
 
  loadChartData() {
    this.http.get<any>(`${this.baseUrl}/chart/summary?month_offset=${this.monthOffset}`)
      .subscribe(response => {
        const data = response.individuals_ready_tasks;
        this.monthTitle = response.month
        this.chartData = Object.entries(data)
          .filter(([key]) => key !== 'totals')
          .map(([name, value]) => ({ name: name.toUpperCase(), value }));

        this.updateMonthName();
      });
  }

  cambiarMes(offset: number) {
    this.monthOffset += offset;
    this.loadChartData();
  }

  updateMonthName() {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + this.monthOffset);

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    this.currentMonthName = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
  }
}
