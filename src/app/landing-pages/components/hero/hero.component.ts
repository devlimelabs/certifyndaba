import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, Input 
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './hero.component.html',
  styleUrls: [ './hero.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  @Input() title = 'Title';
  @Input() description = 'Description';
  @Input() buttonLink = '/candidate/sign-up';
  @Input() buttonText = 'Sign Up for Free';
}
