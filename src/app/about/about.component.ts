import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { MissonComponent } from '../landing-pages/components/misson/misson.component';
import { OurvaluesComponent } from '../landing-pages/components/ourvalues/ourvalues.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    MatButtonModule,
    MissonComponent,
    OurvaluesComponent,
    RouterLink
  ],
  templateUrl: './about.component.html',
  styleUrls: [ './about.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {

}
