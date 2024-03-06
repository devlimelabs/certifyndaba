import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, Input
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

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

  childIsActive = false;

  childLinks: any[] = [];
}
