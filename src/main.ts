import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
const config = appConfig;
config.providers.push(provideAnimationsAsync(), provideHttpClient())
bootstrapApplication(AppComponent, config)
  .catch((err) => console.error(err));
