import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DashboardService } from '../../services/dashboard.service';
import { MessageService } from 'primeng/api';
import { state } from '@angular/animations';

interface ServiceOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-task-by-service',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, DropdownModule, ButtonModule, CardModule],
  templateUrl: './task-by-service.component.html',
  styleUrls: ['./task-by-service.component.css'],
  providers: [MessageService]
})
export class TaskByServiceComponent implements OnInit {
  services: ServiceOption[] = [];
  selectedService: ServiceOption | null = null;
  taskId: string = '';
  result: any = null;
  searchAttempted: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.dashboardService.getAvailableServices().subscribe({
      next: (serviceList: string[]) => {
        this.services = serviceList.map(service => ({
          name: service,
          value: service
        }));
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los servicios disponibles'
        });
      }
    });
  }

  searchTask() {
    this.searchAttempted = true;
    if (!this.selectedService || !this.isValidUuid(this.taskId)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, seleccione un servicio e ingrese un UUID válido'
      });
      return;
    }

    this.dashboardService.getTaskByServiceId(this.selectedService.value, this.taskId).subscribe({
      next: (res) => {
        
        let payload_in= res.payload_in;
        let payload_out = res.payload_out.resumen;          
        res.errors = res.errors.errors;               
        
        let response = { ...res, payload_in, payload_out   }      
        

        this.result = response;
        
        
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
    this.selectedService = null;
    this.taskId = '';
    this.searchAttempted = false;
  }
}