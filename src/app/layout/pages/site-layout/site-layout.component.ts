import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component, ElementRef, inject, OnInit, Renderer2, ViewChild 
} from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FooterComponent } from '../../components/footer/footer.component';
import { MobileNavComponent } from '../../components/mobile-nav/mobile-nav.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LayoutService } from '../../service/layout.service';

@UntilDestroy()
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
export class SiteLayoutComponent implements OnInit {

  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  @ViewChild('mainOutlet') mainOutlet!: ElementRef;

  layoutSvc = inject(LayoutService);
  open = false;

  ngOnInit(): void {
    this.layoutSvc.navigationEnd$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.sidenav.close();
        this.mainOutlet.nativeElement.scrollTo(0,0);
      });

    this.layoutSvc.scrollToTop$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.mainOutlet.nativeElement.scrollTo(0,0);
      });

    this.renderer.setStyle(this.document.getElementById('st-2'), 'display', 'block');
  }

  toggle(open: boolean) {
    this.open = open;
  }
}
