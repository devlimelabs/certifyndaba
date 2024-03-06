import {
  ChangeDetectionStrategy, Component, Input 
} from '@angular/core';
import { CountUpModule } from 'ngx-countup';

@Component({
  standalone: true,
  selector: 'app-misson',
  imports: [ CountUpModule ],
  templateUrl: './misson.component.html',
  styleUrls: [ './misson.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissonComponent {

  @Input() leadingParagraph!: string;
}
