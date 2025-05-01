import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DashboardService } from '../../services/dashboard.service';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export interface Tarea {
  Task: Task;
}

export interface Task {
  user:            string;
  id:              number;
  entity:          string;
  service:         string;
  payload_in:      Payload;
  status:          number;
  job_id:          string;
  kafka_offset:    number;
  dt_created:      Date;
  msg_id:          string;
  state:           number;
  fn:              string;
  payload_out:     Payload;
  errors:          string[];
  kafka_key:       string;
  kafka_partition: number;
  dt_updated:      Date;
}

export interface Payload {
}



@Component({
  selector: 'app-task-by-id',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, IconFieldModule, InputIconModule],
  templateUrl: './task-by-id.component.html',
  styleUrls: ['./task-by-id.component.css'],
  providers: [MessageService] 
})
export class TaskByIdComponent {
  taskId: string = '';
  result: any = null;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  searchTask() {
    console.log('Buscando tarea con ID:', this.taskId);
    
    if (!this.isValidUuid(this.taskId)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, ingrese un UUID válido'
      });
      return;
    }

    this.dashboardService.getTaskById(this.taskId).subscribe({
      next: (res: Tarea) => {

        let payload_in= res.Task.payload_in;
        let payload_out = res.Task.payload_out;          
        // // res.Task.errors = res.Task.errors.errors;               
        
        // // console.log('Respuesta de la API:', res);
        
        let response = { ...res, payload_in, payload_out}     
        

        this.result = res;
        

        
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.detail || 'Error al buscar la tarea'
        });
        this.result = null;
      }
    });
  }

  isValidUuid(uuid: string): boolean {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
  }

  // getObjectEntries(obj: any): Array<{key: string, value: any}> {
  //   if (!obj) return [];
  //   return Object.entries(obj).map(([key, value]) => ({ key, value }));
  // }

  getObjectEntries(obj: any): { key: string; value: any }[] {
    return Object.entries(obj).map(([key, value]) => {
      const isObject = value && typeof value === 'object' && !Array.isArray(value);
      const isArray = Array.isArray(value);
  
      return {
        key,
        value: isObject || isArray ? JSON.stringify(value, null, 2) : value
      };
    });
  }

  clearResults() {
    this.result = null;    
    this.taskId = '';
  }
}
