import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, Input, signal, viewChildren
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-menu-link',
  templateUrl: './nav-menu-link.component.html',
  styleUrls: [ './nav-menu-link.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavMenuLinkComponent {

  @Input() link!: any;

  childLinks = viewChildren(RouterLinkActive);

  childIsActive = signal(false);
}
