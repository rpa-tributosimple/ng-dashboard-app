import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from '../../services/dashboard.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, ButtonModule],
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
  providers: [MessageService]
})
export class QueueComponent implements OnInit {
  queueData: any[] = [];
  columns: string[] = [];
  loading: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.dashboardService.getQueueTasks().subscribe({
      next: (res) => {
        console.log(res);
        if (res.individuals_queques_tasks) {
          const data = res.individuals_queques_tasks;
          this.queueData = [data];
          this.columns = Object.keys(data);
        }
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las tareas pendientes'
        });
        this.loading = false;
      }
    });
  }
}