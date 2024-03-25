import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import orderBy from 'lodash/orderBy';
// import { PushNotificationsService } from 'src/app/core/push-notifications/push-notifications.service';

import { LayoutService } from '../../service/layout.service';
import { NavMenuLinkComponent } from '../nav-menu-link/nav-menu-link.component';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../auth/auth.service';
import {
  collection, Firestore, getDocs
} from '@angular/fire/firestore';
import { map } from 'rxjs';
import { Auth } from '@angular/fire/auth';

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

  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  authSvc = inject(AuthService);
  layoutSvc = inject(LayoutService);

  isAdmin$ = this.authSvc.claims$.pipe(map(claims => claims?.role === 'admin'));

  loggedIn = this.authSvc.isLoggedIn$;

  navLinks = signal<any[]>([]);

  async ngOnInit(): Promise<void> {
    const appLinksRef = collection(this.firestore, 'app-nav-links');
    const appLinksSnapshot = (await getDocs(appLinksRef));
    let links: any[] = [];

    appLinksSnapshot.forEach(doc => {
      links.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log('this.authSvc.$claims()', this.authSvc.$claims());
    links = links.filter(link => {
      console.log('link', link);
      return !link.groups?.length || link.groups?.includes(this.authSvc.$claims()?.accountType);
    });
    console.log('links', links);

    this.navLinks.set(orderBy(links, 'order'));
    // this.pushNotificationsSvc.init();
  }

  async signOut(): Promise<void> {
    this.authSvc.signOut();
  }
}
