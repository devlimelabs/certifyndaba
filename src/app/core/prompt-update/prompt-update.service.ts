import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {
  delay, filter, tap
} from 'rxjs/operators';

import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class PromptUpdateService {

  constructor(
    toast: HotToastService,
    updates: SwUpdate
  ) {
    updates.versionUpdates
      .pipe(
        filter(ev => ev.type === 'VERSION_READY'),
        tap(() => toast.info('A new version is available, the page will refresh to load it!')),
        delay(1500)
      )
      .subscribe(() => {
        updates.activateUpdate().then(() => document.location.reload());
      });
  }
}
