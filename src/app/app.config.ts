import {
  ApplicationConfig, importProvidersFrom, isDevMode
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  ScreenTrackingService, UserTrackingService, provideAnalytics, getAnalytics
} from '@angular/fire/analytics';
import {
  popperVariation, provideTippyConfig, tooltipVariation
} from '@ngneat/helipopper';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthStore } from '~auth/state/auth.store';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthStore,
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      ConfirmationModule,
      EditorModule
    ),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    provideHotToastConfig(),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation
      }
    }),
    ScreenTrackingService,
    UserTrackingService,    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initAuthService,
    //   deps: [ AuthService, Auth ],
    //   multi: true
    // }

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
    // provideServiceWorker('safety-worker.js', {
    //   enabled: !isDevMode(),
    //   registrationStrategy: 'registerWhenStable:30000'
    // })
  ]
};
