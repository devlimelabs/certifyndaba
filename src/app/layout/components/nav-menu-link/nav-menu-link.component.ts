import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { NavLink } from '~graphql-api';

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
export class NavMenuLinkComponent implements OnChanges {

  @Input() link!: NavLink;

  childIsActive = false;

  childLinks: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['link']) {
      try {
        this.childLinks = JSON.parse(this.link?.childLinks as any);
      } catch (err) {
        this.childLinks = [];
      }
    }
  }
}
