import { SharedModule } from './shared/shared.module';
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
import { environment } from 'src/environments/environment';
register();

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { appReducer } from './shared/store/app.state';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
registerLocaleData(localePt, 'pt-BR');

import { passiveSupport } from 'passive-events-support/src/utils'
import { getAuth, provideAuth } from '@angular/fire/auth';
passiveSupport({/*...*/})

// LOTTIE
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { getApp } from 'firebase/app';
import { userReducer } from './shared/store/user.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(
      {
        mode: 'md',
        scrollAssist: false,
        swipeBackEnabled: false,
        innerHTMLTemplatesEnabled: true
        // scrollPadding: false
      }
    ),
    StoreModule.forRoot({
      app: appReducer,
      user: userReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode()
    }),
    IonicStorageModule.forRoot({
      name: 'anfitrion-dashboard-storage',
      storeName: 'anfitrion-dashboard-store',
      dbKey: 'anfitrion-dashboard-key'
    })
  ],
  providers: [
    Storage,
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    },
    {
      provide:  DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },
    provideHttpClient(),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },

    // Inicialização do app principal
    provideFirebaseApp(() => initializeApp(environment.anfitrionFirebaseConfig)),
    provideFirestore(() => getFirestore()), // Firestore para o app principal
    provideAuth(() => {
      const auth = getAuth();
      // Conectar ao emulador do Auth
     // {
     //   connectAuthEmulator(auth, 'http://localhost:9099')
    //  }
      return auth;
    }), // Auth para o app principal

    // Inicialização do segundo app (para 'anfitrion-management')
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig, 'anfitrion-management')),
    provideFirestore(() => getFirestore(getApp('anfitrion-management'))),
     //provideAuth(() => getAuth(getApp('anfitrion-management'))), // Auth para o segundo app

    provideLottieOptions({
      player: () => player
    })
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
