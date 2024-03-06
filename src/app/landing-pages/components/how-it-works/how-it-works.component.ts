import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './how-it-works.component.html',
  styleUrls: [ './how-it-works.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HowItWorksComponent {

}
