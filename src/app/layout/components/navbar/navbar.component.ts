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
import { AuthService } from '../../../auth/auth.service';

import { LayoutService } from '../../service/layout.service';
import { NavMenuLinkComponent } from '../nav-menu-link/nav-menu-link.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  filter, firstValueFrom, lastValueFrom, switchMap
} from 'rxjs';
import {
  collection, Firestore, getDocs, orderBy, query, where
} from '@angular/fire/firestore';
import { LoginComponent } from '../../../auth/pages/login/login.component';
import { AuthStore } from '~auth/state/auth.store';

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
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private firestore = inject(Firestore);
  authSvc = inject(AuthService);
  authStore = inject(AuthStore);
  layoutSvc = inject(LayoutService);

  loggedIn = signal(false);

  navLinks = signal<any[]>([]);

  ngOnInit(): void {
    this.authSvc.isLoggedIn$
      .pipe(
        switchMap(async loggedIn => {
          let linksRef;

          if (loggedIn) {
            let accountType = this.authStore.accountType();

            if (!accountType) {
              accountType = (await firstValueFrom(this.authSvc.claims$.pipe(filter(claims => !!claims))))?.accountType;
            }

            linksRef = query(
              collection(this.firestore, 'app-nav-links'),
              where('groups', 'array-contains', accountType),
              orderBy('order')
            );
          } else {
            linksRef = query(
              collection(this.firestore, 'nav-links'),
              orderBy('order')
            );
          }

          return await getDocs(linksRef);
        })
      ).subscribe(linksSnapshot => {
        let links: any[] = [];

        linksSnapshot.forEach(doc => {
          links.push({
            id: doc.id,
            ...doc.data()
          });
        });

        this.navLinks.set(links);
      });
  }

  async signIn(): Promise<any> {
    const dialogRef = this.dialog.open(LoginComponent, {
      closeOnNavigation: true,
      hasBackdrop: false,
      maxWidth: '90vw'
    });

    await lastValueFrom(dialogRef.afterClosed());
  }

  async signOut(): Promise<void> {
    await this.authSvc.signOut();
  }

}
