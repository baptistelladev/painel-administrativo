import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule, isDevMode } from '@angular/core';
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
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { ruaGastronomicaDeSantosReducer } from './shared/store/ruaGastronomicaDeSantos.state';
import { environment } from 'src/environments/environment';
register();

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }), StoreModule.forRoot({ruaGastronomicaDeSantos: ruaGastronomicaDeSantosReducer })],
  providers: [ {
    provide: LOCALE_ID,
    useValue: "pt-BR"
  },
  {
    provide:  DEFAULT_CURRENCY_CODE,
    useValue: 'BRL'
  },provideHttpClient(),{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideFirebaseApp(() => initializeApp(environment.anfitrionFirebaseConfig)), provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent],
})
export class AppModule {}
