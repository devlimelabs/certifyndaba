import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  Router, RouterLink, RouterLinkActive
} from '@angular/router';
import { signOut } from 'aws-amplify/auth';
import orderBy from 'lodash/orderBy';
import { AppAuthState } from 'src/app/auth/state/auth.state';
import { PushNotificationsService } from 'src/app/core/push-notifications/push-notifications.service';

import { LayoutService } from '../../service/layout.service';
import { NavMenuLinkComponent } from '../nav-menu-link/nav-menu-link.component';
import { MatMenuModule } from '@angular/material/menu';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../../../graphql/queries';
@Component({
  selector: 'app-app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
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
  templateUrl: './app-navbar.component.html',
  styleUrls: [ './app-navbar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavbarComponent implements OnInit {
  @Output() toggleSideNav = new EventEmitter();

  private client = generateClient();
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private pushNotificationsSvc = inject(PushNotificationsService);

  appAuthState = inject(AppAuthState);
  layoutSvc = inject(LayoutService);

  isAdmin$ = this.appAuthState.isAdmin$;
  loggedIn = false;

  navLinks: any[] = [];

  get user(): any {
    return this.appAuthState.get('user');
  }

  async ngOnInit(): Promise<void> {
    const links = await this.client.graphql({
      query: queries.listAppNavLinks
    }) as any;

    console.log('app links', links);
    this.navLinks = orderBy(links?.items, 'order');
    this.cdr.markForCheck();
    this.pushNotificationsSvc.init();
  }

  async signOut(): Promise<void> {
    await signOut();

    this.router.navigateByUrl('/');
  }
}
