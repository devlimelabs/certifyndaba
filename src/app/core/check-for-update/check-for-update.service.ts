import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService {

  // constructor(
  //   @Inject(ApplicationRef) private appRef: ApplicationRef,
  //   updates: SwUpdate
  // ) {
  //   // Allow the app to stabilize first, before starting
  //   // polling for updates with `interval()`.
  //   const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
  //   const everySixHours$ = interval(6 * 60 * 60 * 1000);
  //   const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

  //   everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());
  // }
}
