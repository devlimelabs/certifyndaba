import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SanitizePipe } from '~shared/sanitize.pipe';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [
    CommonModule,
    RouterModule,
    SanitizePipe
  ],
  templateUrl: './hero.component.html',
  styleUrls: [ './hero.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  @Input() title = 'Title';
  @Input() description: any = 'Description';
  @Input() buttonLink: string | undefined;
  @Input() buttonText = 'Sign Up for Free';

  @Output() buttonClick = new EventEmitter();
}
