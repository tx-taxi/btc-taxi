import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ZONE_SERVICE } from '@app/injection-tokens';


import { ElectrsApiService } from '@app/services/electrs-api.service';
import { OrdApiService } from '@app/services/ord-api.service';
import { StateService } from '@app/services/state.service';
import { CacheService } from '@app/services/cache.service';
import { PriceService } from '@app/services/price.service';
import { EnterpriseService } from '@app/services/enterprise.service';
import { WebsocketService } from '@app/services/websocket.service';
import { AudioService } from '@app/services/audio.service';
import { PreloadService } from '@app/services/preload.service';
import { SeoService } from '@app/services/seo.service';
import { OpenGraphService } from '@app/services/opengraph.service';
import { ZoneService } from '@app/services/zone-shim.service';
import { SharedModule } from '@app/shared/shared.module';
import { StorageService } from '@app/services/storage.service';
import { HttpCacheInterceptor } from '@app/services/http-cache.interceptor';
import { LanguageService } from '@app/services/language.service';
import { ThemeService } from '@app/services/theme.service';
import { TimeService } from '@app/services/time.service';
import { FiatShortenerPipe } from '@app/shared/pipes/fiat-shortener.pipe';
import { FiatCurrencyPipe } from '@app/shared/pipes/fiat-currency.pipe';
import { ShortenStringPipe } from '@app/shared/pipes/shorten-string-pipe/shorten-string.pipe';
import { CapAddressPipe } from '@app/shared/pipes/cap-address-pipe/cap-address-pipe';
import { AppPreloadingStrategy } from '@app/app.preloading-strategy';
import { ServicesApiServices } from '@app/services/services-api.service';
import { DatePipe } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { LightningShellComponent } from './lightning-shell.component';
import { LightningRootComponent } from './lightning-root.component';
import { LightningWebsocketService } from './lightning-websocket.service';
import { LightningStatusInterceptor } from './lightning-status.service';
const routes: Routes = [{ path: '', component: LightningShellComponent, children: [
  { path: 'docs', loadChildren: () => import('@app/docs/docs.module').then(m => m.DocsModule) },
  { path: 'about', loadChildren: () => import('@components/about/about.module').then(m => m.AboutModule) },
  { path: 'terms-of-service', loadChildren: () => import('@components/terms-of-service/terms-of-service.module').then(m => m.TermsOfServiceModule) },
  { path: 'privacy-policy', loadChildren: () => import('@components/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule) },
  { path: 'trademark-policy', loadChildren: () => import('@components/trademark-policy/trademark-policy.module').then(m => m.TrademarkModule) },
  { path: '', loadChildren: () => import('@app/lightning/lightning.module').then(m => m.LightningModule) },
]}];
const providers = [
  ElectrsApiService,
  OrdApiService,
  StateService,
  CacheService,
  PriceService,
  { provide: WebsocketService, useClass: LightningWebsocketService },
  AudioService,
  SeoService,
  OpenGraphService,
  StorageService,
  EnterpriseService,
  LanguageService,
  ThemeService,
  TimeService,
  ShortenStringPipe,
  FiatShortenerPipe,
  FiatCurrencyPipe,
  CapAddressPipe,
  AppPreloadingStrategy,
  ServicesApiServices,
  PreloadService,
  { provide: HTTP_INTERCEPTORS, useClass: HttpCacheInterceptor, multi: true },
  { provide: ZONE_SERVICE, useClass: ZoneService },
];

@NgModule({ declarations: [LightningRootComponent, LightningShellComponent], bootstrap: [LightningRootComponent], imports: [BrowserModule, BrowserAnimationsModule, SharedModule, RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })], providers: [provideHttpClient(withInterceptorsFromDi()), DatePipe, ...providers, { provide: HTTP_INTERCEPTORS, useClass: LightningStatusInterceptor, multi: true }] })
export class LightningAppModule {}
