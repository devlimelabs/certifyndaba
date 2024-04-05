import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, signal
} from '@angular/core';
import {
  collection, Firestore, getDocs,
  orderBy,
  query,
  where
} from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import _orderBy from 'lodash/orderBy';
import { AuthService } from '../../../auth/auth.service';
import { LayoutService } from '../../service/layout.service';
import { MatMenuModule } from '@angular/material/menu';
import { filter, switchMap } from 'rxjs/operators';
import { AuthStore } from '~auth/state/auth.store';
import { firstValueFrom } from 'rxjs';

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

  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  authSvc = inject(AuthService);
  authStore = inject(AuthStore);
  layoutSvc = inject(LayoutService);
  navLinks = signal<any[]>([]);

  ngOnInit(): void {
    this.authSvc.isLoggedIn$
      .pipe(
        untilDestroyed(this),
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
        const links: any[] = [];

        linksSnapshot.forEach(doc => {
          links.push({
            id: doc.id,
            ...doc.data()
          });
        });

        this.navLinks.set(_orderBy(links, 'order'));

        this.cdr.markForCheck();
      });
  }

  getChildLinks(childLinks: string): any[] {
    return JSON.parse(childLinks);
  }

  async signOut(): Promise<void> {
    this.authSvc.signOut();
  }
}
