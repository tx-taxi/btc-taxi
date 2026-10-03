import '@angular/localize/init';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LightningAppModule } from './app/lightning-app/lightning-app.module';
import { environment } from './environments/environment';
if (environment.production) enableProdMode();
platformBrowserDynamic().bootstrapModule(LightningAppModule).catch(error => console.error(error));
