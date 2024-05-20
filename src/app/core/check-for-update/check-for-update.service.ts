import { isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef, Inject, Injectable, PLATFORM_ID
} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService {

  constructor(
    @Inject(ApplicationRef) private appRef: ApplicationRef,
    @Inject(PLATFORM_ID) platformId: Object,
    updates: SwUpdate
  ) {

    if (isPlatformBrowser(platformId) && navigator?.serviceWorker) {
      navigator?.serviceWorker?.getRegistrations().then((registrations: any) => {
        if (!registrations.length) {
          console.log('No serviceWorker registrations found.');
          return;
        }
        for (let registration of registrations) {
          registration.unregister().then(function (unregistered: boolean) {
            console.log(
              (unregistered ? 'Successfully unregistered' : 'Failed to unregister'), 'ServiceWorkerRegistration\n' +
              (registration.installing ? '  .installing.scriptURL = ' + registration.installing.scriptURL + '\n' : '') +
              (registration.waiting ? '  .waiting.scriptURL = ' + registration.waiting.scriptURL + '\n' : '') +
              (registration.active ? '  .active.scriptURL = ' + registration.active.scriptURL + '\n' : '') +
              '  .scope: ' + registration.scope + '\n'
            );
          });
        }
      });
    }

    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());
  }
}
