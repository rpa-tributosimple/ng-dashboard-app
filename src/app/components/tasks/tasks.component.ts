import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from '../../services/dashboard.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, ButtonModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [MessageService]
})
export class TasksComponent implements OnInit {
  tasksData: any[] = [];
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
    this.dashboardService.getReadyTasks().subscribe({
      next: (res) => {
        console.log(res); 
        
        if (res.finished_tasks) {
          const data = res.finished_tasks;
          this.tasksData = [data];
          this.columns = Object.keys(data);
        }
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las tareas completadas'
        });
        this.loading = false;
      }
    });
  }
}