import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { delay } from 'rxjs/operators';

import { FooterComponent } from '../../components/footer/footer.component';
import { MobileNavComponent } from '../../components/mobile-nav/mobile-nav.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LayoutService } from '../../service/layout.service';
import { AppNavbarComponent } from '../../components/app-navbar/app-navbar.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  standalone: true,
  imports: [
    AppNavbarComponent,
    CommonModule,
    FooterComponent,
    MatSidenavModule,
    MobileNavComponent,
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: [ './app-layout.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class AppLayoutComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  private destroyRef = inject(DestroyRef);
  private layoutSvc = inject(LayoutService);

  isMobile$ = this.layoutSvc.isMobile$;
  loading$ = this.layoutSvc.loading$.pipe(delay(0));
  open = false;
  pageTitle$ = this.layoutSvc.pageTitle$;

  constructor() {
    afterNextRender(() => {
      this.layoutSvc.navigationEnd$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.sidenav.close());
    });
  }

  toggle(open: boolean) {
    this.open = open;
  }
}
