import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

// SWIPER
import {register} from 'swiper/element/bundle';
register();

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [ {
    provide: LOCALE_ID,
    useValue: "pt-BR"
  },
  {
    provide:  DEFAULT_CURRENCY_CODE,
    useValue: 'BRL'
  },provideHttpClient(),{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp({"projectId":"ruagastronomicadesantos-314","appId":"1:630646945223:web:d6f8ceb333ffa41de355e2","storageBucket":"ruagastronomicadesantos-314.appspot.com","apiKey":"AIzaSyCpJvwtqKsGRHL2x-NWzT79kSBtXTy5TIA","authDomain":"ruagastronomicadesantos-314.firebaseapp.com","messagingSenderId":"630646945223","measurementId":"G-FNZFE8BMZY"})), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
