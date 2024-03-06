import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, OnInit, Output, signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Router, RouterLink, RouterLinkActive
} from '@angular/router';
import { generateClient } from 'aws-amplify/api';
import orderBy from 'lodash/orderBy';
import { AppAuthState } from 'src/app/auth/state/auth.state';
import { PushNotificationsService } from 'src/app/core/push-notifications/push-notifications.service';
import { listNavLinks } from 'src/graphql/queries';

import { LayoutService } from '../../service/layout.service';
import { NavMenuLinkComponent } from '../nav-menu-link/nav-menu-link.component';
import { DescopeAuthService } from '@descope/angular-sdk';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { lastValueFrom, switchMap } from 'rxjs';
import { UserSignupOrInComponent } from 'src/app/auth/pages/user-signup-or-in/user-signup-or-in.component';
import * as queries from '../../../../graphql/queries';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    NavMenuLinkComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrls: [ './navbar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  @Output() toggleSideNav = new EventEmitter();

  private cdr = inject(ChangeDetectorRef);
  private descopeSvc = inject(DescopeAuthService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private pushNotificationsSvc = inject(PushNotificationsService);

  appAuthState = inject(AppAuthState);
  layoutSvc = inject(LayoutService);

  loggedIn = signal(false);

  navLinks: any[] = [];

  get user(): any {
    return this.appAuthState.get('user');
  }

  ngOnInit(): void {
    const client = generateClient();

    this.appAuthState.isLoggedIn$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(async loggedIn => {
          this.loggedIn.set(loggedIn);

          if (loggedIn) {
            const links = (await client.graphql({
              query: queries.listAppNavLinks
            }))?.data?.listAppNavLinks?.items;

            this.pushNotificationsSvc.init();

            return links;
          } else {
            return (await client.graphql({
              query: listNavLinks,
              authMode: 'iam'
            }))?.data?.listNavLinks?.items;
          }
        })
      ).subscribe(links => {
        this.navLinks = orderBy(links, 'order');
        this.cdr.markForCheck();
        console.log('links', links);
      });
  }

  async signIn(): Promise<any> {
    const dialogRef = this.dialog.open(UserSignupOrInComponent, {
      closeOnNavigation: true
    });

    await lastValueFrom(dialogRef.afterClosed());
  }

  async signOut(): Promise<void> {
    await lastValueFrom(this.descopeSvc.descopeSdk.logout());

    this.router.navigateByUrl('/');
  }

}
