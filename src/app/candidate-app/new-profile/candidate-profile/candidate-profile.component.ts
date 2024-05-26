import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-candidate-profile',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './candidate-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateProfileComponent { }
