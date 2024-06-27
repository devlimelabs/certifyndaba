import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-multi-location-search',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './multi-location-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiLocationSearchComponent { }
