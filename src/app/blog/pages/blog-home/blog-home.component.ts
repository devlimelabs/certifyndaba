import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, input
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    RouterLink
  ],
  templateUrl: './blog-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogHomeComponent {
  blogList = input<any[]>();
}
