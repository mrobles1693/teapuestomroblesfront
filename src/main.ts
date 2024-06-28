import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';

export function getBackUrl(){
  return environment.back_url;
}

const providers = [
  { provide : 'BACK_URL', useFactory: getBackUrl, deps: [] },
];

if(environment.production){
  enableProdMode();
}
platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
