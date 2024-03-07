import { CommonModule, DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  inject,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay } from 'rxjs/operators';

import { FooterComponent } from '../../components/footer/footer.component';
import { MobileNavComponent } from '../../components/mobile-nav/mobile-nav.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LayoutService } from '../../service/layout.service';
import { AppNavbarComponent } from '../../components/app-navbar/app-navbar.component';

@UntilDestroy()
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

  private layoutSvc = inject(LayoutService);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  isMobile$ = this.layoutSvc.isMobile$;
  loading$ = this.layoutSvc.loading$.pipe(delay(0));
  open = false;
  pageTitle$ = this.layoutSvc.pageTitle$;

  constructor() {
    afterNextRender(() => {
      this.layoutSvc.navigationEnd$
        .pipe(untilDestroyed(this))
        .subscribe(() => this.sidenav.close());

      this.renderer.setStyle(this.document.getElementById('st-2'), 'display', 'none');
    });
  }

  toggle(open: boolean) {
    this.open = open;
  }
}
