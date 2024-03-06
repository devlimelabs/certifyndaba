import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, Input 
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface Feature {
  title: string;
  text: string;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-features',
  imports: [ CommonModule, MatIconModule ],
  templateUrl: './features.component.html',
  styleUrls: [ './features.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() imageUrl = '';
  @Input() features: Feature[] = [];
}
