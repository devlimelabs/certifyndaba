import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal
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
// import { PushNotificationsService } from 'src/app/core/push-notifications/push-notifications.service';

import { LayoutService } from '../../service/layout.service';
import { NavMenuLinkComponent } from '../nav-menu-link/nav-menu-link.component';
import { MatMenuModule } from '@angular/material/menu';
import {
  collection, Firestore, getDocs, orderBy, query, where
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthStore } from '~auth/state/auth.store';
import { AuthService } from '~auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs/operators';

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

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  @Output() toggleSideNav = new EventEmitter();

  authStore = inject(AuthStore);
  authSvc = inject(AuthService);
  layoutSvc = inject(LayoutService);

  navLinks = signal<any[]>([]);


  async ngOnInit(): Promise<void> {
    this.authSvc.isLoggedIn$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(isLoggedIn => !!isLoggedIn),
      switchMap(() => this.authSvc.claims$),
      filter(claims => !!claims?.accountType),
      switchMap(claims => {
        const appLinksRef = query(
          collection(this.firestore, 'app-nav-links'),
          where('groups', 'array-contains', claims?.accountType),
          orderBy('order')
        );

        return getDocs(appLinksRef);
      })
    ).subscribe(appLinksSnapshot => {
      let links: any[] = [];

      appLinksSnapshot.forEach(doc => {
        links.push({
          id: doc.id,
          ...doc.data()
        });
      });

      this.navLinks.set(links);
    });
    // this.pushNotificationsSvc.init();
  }

  async signOut(): Promise<void> {
    this.authSvc.signOut();
  }
}
