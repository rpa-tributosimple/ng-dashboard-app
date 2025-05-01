import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig, // <-- aquí expandes tu configuración original
  providers: [
    ...(appConfig.providers || []), // <-- mantienes los providers de appConfig
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
  ]
}).catch(err => console.error(err));