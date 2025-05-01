import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DashboardService } from './services/dashboard.service';
import { TasksComponent } from '../app/components/tasks/tasks.component';
import { QueueComponent } from '../app/components/queue/queue.component';
import { TaskByIdComponent } from '../app/components/task-by-id/task-by-id.component';
import { TaskByServiceComponent } from '../app/components/task-by-service/task-by-service.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CardModule,
    TabViewModule,
    MessageModule,
    ToastModule,
    TasksComponent,
    QueueComponent,
    TaskByIdComponent,
    TaskByServiceComponent
  ],
  providers: [DashboardService, MessageService],
  template: `
    <div class="container">
      <p-toast></p-toast>
      <h1>Dashboard Kafka Tributo Simple</h1>
      
      <p-tabView>
        <p-tabPanel header="Tareas Completadas y Pendientes">
          <div class="grid">
            <div class="col-12 md:col-6">
              <app-tasks></app-tasks>
            </div>
            <div class="col-12 md:col-6">
              <app-queue></app-queue>
            </div>
          </div>
        </p-tabPanel>
        <p-tabPanel header="Consultar Tareas">
          <div class="grid">
            <div class="col-12 md:col-6">
              <app-task-by-id></app-task-by-id>
            </div>
            <div class="col-12 md:col-6">
              <app-task-by-service></app-task-by-service>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      color: #495057;
      margin-bottom: 2rem;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor() {}
  
  ngOnInit() {}
}