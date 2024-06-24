import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, input
} from '@angular/core';
import { CertificationNamePipe } from '~shared/certification-name/certification-name.pipe';

@Component({
  selector: 'app-connected-candidate-card',
  standalone: true,
  imports: [ CertificationNamePipe, CommonModule ],
  templateUrl: './connected-candidate-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectedCandidateCardComponent {
  candidate = input.required<any>();
}
