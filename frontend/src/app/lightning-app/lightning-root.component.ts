import { Component, HostBinding, Inject, LOCALE_ID } from '@angular/core';

@Component({selector:'app-root',standalone:false,template:'<router-outlet></router-outlet>'})
export class LightningRootComponent {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  private get rtl(): boolean { return /^(ar|fa|he)(?:[-_]|$)/i.test(this.locale); }
  @HostBinding('attr.dir') get dir(): string { return this.rtl ? 'rtl' : 'ltr'; }
  @HostBinding('class') get layoutClass(): string { return this.rtl ? 'rtl-layout' : 'ltr-layout'; }
}
