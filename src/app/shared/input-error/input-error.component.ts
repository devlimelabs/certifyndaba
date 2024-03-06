import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, Input 
} from '@angular/core';
import ERROR_MESSAGES from '~constants/error-messages';

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './input-error.component.html',
  styleUrls: [ './input-error.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputErrorComponent {

  readonly errorMessages: any = { ...ERROR_MESSAGES };

  @Input() errors: any;

}
