import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ourvalues',
  templateUrl: './ourvalues.component.html',
  styleUrls: [ './ourvalues.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OurvaluesComponent {

}
