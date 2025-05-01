import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of  } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // private DEV = true
  private baseUrl = environment.baseUrl;
 


  constructor(private http: HttpClient) {}

  
//////////////////////////////////////////////////////////////////////////////////////
 
getQueueTasks(): Observable<any> {
  return forkJoin({
    afip: this.getQueueTasksByType('afip'),
    afccma: this.getQueueTasksByType('afccma'),
    afsales: this.getQueueTasksByType('afsales'),
    afddjj: this.getQueueTasksByType('afddjj'),
    afpurch: this.getQueueTasksByType('afpurch'),
    afconst: this.getQueueTasksByType('afconst'),
    agip: this.getQueueTasksByType('agip'),
    arba: this.getQueueTasksByType('arba')
  }).pipe(
    map(results => {
      const total = Object.values(results).reduce((sum: number, current: any) => sum + current.count, 0);
      return {
        individuals_queques_tasks: {
          afip: results.afip.count,
          afccma: results.afccma.count,
          afsales: results.afsales.count,
          afddjj: results.afddjj.count,
          afpurch: results.afpurch.count,
          afconst: results.afconst.count,
          agip: results.agip.count,
          arba: results.arba.count,
          totals: total
        }
      };
    }),
    catchError(error => {
      console.error('Error obteniendo tareas en cola:', error);
      // Retornar un objeto con valores predeterminados o manejar el error como consideres mejor
      return of({
        individuals_queques_tasks: {
          afip: 0, afccma: 0, afsales: 0, afddjj: 0, afpurch: 0, afconst: 0, agip: 0, arba: 0, totals: 0
        }
      });
    })
  );
}

// Método para obtener todas las tareas finalizadas
getReadyTasks(): Observable<any> {
  return forkJoin({
    afip: this.getReadyTasksByType('afip'),
    afccma: this.getReadyTasksByType('afccma'),
    afsales: this.getReadyTasksByType('afsales'),
    afddjj: this.getReadyTasksByType('afddjj'),
    afpurch: this.getReadyTasksByType('afpurch'),
    afconst: this.getReadyTasksByType('afconst'),
    agip: this.getReadyTasksByType('agip'),
    arba: this.getReadyTasksByType('arba')
  }).pipe(
    map(results => {
      const total = Object.values(results).reduce((sum: number, current: any) => sum + current.count, 0);
      return {
        finished_tasks: {
          afip: results.afip.count,
          afccma: results.afccma.count,
          afsales: results.afsales.count,
          afddjj: results.afddjj.count,
          afpurch: results.afpurch.count,
          afconst: results.afconst.count,
          agip: results.agip.count,
          arba: results.arba.count,
          totals: total
        }
      };
    }),
    catchError(error => {
      console.error('Error obteniendo tareas finalizadas:', error);
      return of({
        finished_tasks: {
          afip: 0, afccma: 0, afsales: 0, afddjj: 0, afpurch: 0, afconst: 0, agip: 0, arba: 0, totals: 0
        }
      });
    })
  );
}

// Alternativa: Usar los endpoints de resumen
getQueueTasksSummary(): Observable<any> {
  return this.http.get(`${this.baseUrl}/queue/summary`).pipe(
    catchError(error => {
      console.error('Error obteniendo resumen de tareas en cola:', error);
      return of({ individuals_queques_tasks: { totals: 0 } });
    })
  );
}

getReadyTasksSummary(): Observable<any> {
  return this.http.get(`${this.baseUrl}/ready/summary`).pipe(
    catchError(error => {
      console.error('Error obteniendo resumen de tareas finalizadas:', error);
      return of({ finished_tasks: { totals: 0 } });
    })
  );
}

// Métodos auxiliares genéricos
private getQueueTasksByType(type: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/queue/${type}`).pipe(
    catchError(error => {
      console.error(`Error obteniendo tareas en cola de tipo ${type}:`, error);
      return of({ count: 0 });
    })
  );
}

private getReadyTasksByType(type: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/ready/${type}`).pipe(
    catchError(error => {
      console.error(`Error obteniendo tareas finalizadas de tipo ${type}:`, error);
      return of({ count: 0 });
    })
  );
}

// Método para obtener ambos tipos de tareas simultáneamente
getAllTasksStatuses(): Observable<any> {
  return forkJoin({
    queueTasks: this.getQueueTasks(),
    readyTasks: this.getReadyTasks()
  }).pipe(
    map(results => ({
      queue: results.queueTasks.individuals_queques_tasks,
      finished: results.readyTasks.finished_tasks
    })),
    catchError(error => {
      console.error('Error obteniendo estatus de todas las tareas:', error);
      return of({
        queue: { totals: 0 },
        finished: { totals: 0 }
      });
    })
  );
}

////////////////////////////////////////////////////////////////////////////////////
  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_task?id=${id}`);
  }

  getTaskByServiceId(service: string, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/task_by/service/id?param_servicio=${service}&msg_id=${id}`);
  }

  getAvailableServices(): Observable<string[]> {
    // Simulating getting available services
    // In a real app, you might want to fetch this from the backend
    return new Observable(observer => {
      observer.next([
        'get_sales',
        'sales2',
        'purchases',
        'purchases2',
        'ccma',
        'ccma2',
        'ddjj',
        'ddjj2',
        'get_category',
        'alta_monotributo',
        'get_image',
        'siper'
      ]);
      observer.complete();
    });
  }
}