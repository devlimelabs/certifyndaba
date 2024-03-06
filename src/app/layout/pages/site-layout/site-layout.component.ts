import { CommonModule, DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '../../components/footer/footer.component';
import { MobileNavComponent } from '../../components/mobile-nav/mobile-nav.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LayoutService } from '../../service/layout.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    MatSidenavModule,
    MobileNavComponent,
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './site-layout.component.html',
  styleUrls: [ './site-layout.component.scss' ]
})
export class SiteLayoutComponent {

  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  @ViewChild('mainOutlet') mainOutlet!: ElementRef;

  layoutSvc = inject(LayoutService);
  open = false;

  constructor() {
    afterNextRender(() => {
      this.layoutSvc.navigationEnd$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.sidenav.close();
          this.mainOutlet.nativeElement.scrollTo(0,0);
        });

      this.layoutSvc.scrollToTop$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.mainOutlet.nativeElement.scrollTo(0,0);
        });

      this.renderer.setStyle(this.document.getElementById('st-2'), 'display', 'block');
    });
  }

  toggle(open: boolean) {
    this.open = open;
  }
}
