import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Router, RouterLink, RouterLinkActive
} from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { generateClient } from 'aws-amplify/api';
import { orderBy } from 'lodash';
import { AppAuthState } from 'src/app/auth/state/auth.state';
import { PushNotificationsService } from 'src/app/core/push-notifications/push-notifications.service';
import { listAppNavLinks, listNavLinks } from 'src/graphql/queries';

import { LayoutService } from '../../service/layout.service';
import { MatMenuModule } from '@angular/material/menu';
import { DescopeAuthService } from '@descope/angular-sdk';
import { lastValueFrom, switchMap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './mobile-nav.component.html',
  styleUrls: [ './mobile-nav.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileNavComponent implements OnInit {
  @Output() toggleSideNav = new EventEmitter();

  private client = generateClient();
  private descopeSvc = inject(DescopeAuthService);
  private pushNotificationsSvc = inject(PushNotificationsService);
  private router = inject(Router);

  appAuthState = inject(AppAuthState);
  layoutSvc = inject(LayoutService);
  loggedIn = signal(false);
  navLinks: WritableSignal<any[]> = signal([]);

  get user(): any {
    return this.appAuthState.get('user');
  }

  ngOnInit(): void {
    this.appAuthState.isLoggedIn$
      .pipe(untilDestroyed(this),
        switchMap(async loggedIn => {
          this.loggedIn.set(loggedIn);
          if (loggedIn) {
            const links = (await this.client.graphql({
              query: listAppNavLinks
            }))?.data?.listAppNavLinks;

            this.pushNotificationsSvc.init();

            return links;
          } else {
            return (await this.client.graphql({
              query: listNavLinks,
              authMode: 'iam'
            }))?.data?.listNavLinks;
          }
        }))
      .subscribe(links => {
        this.navLinks.set(orderBy(links, 'order'));
      });
  }

  getChildLinks(childLinks: string): any[] {
    return JSON.parse(childLinks);
  }

  async signOut(): Promise<void> {
    await lastValueFrom(this.descopeSvc.descopeSdk.logout());

    this.router.navigateByUrl('/sign-in');
  }
}
