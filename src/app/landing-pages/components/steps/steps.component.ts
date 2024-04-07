import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: './steps.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsComponent { }
