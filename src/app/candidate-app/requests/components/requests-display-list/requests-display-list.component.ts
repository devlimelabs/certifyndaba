import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, Input 
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-requests-display-list',
  templateUrl: './requests-display-list.component.html',
  styleUrls: [ './requests-display-list.component.scss' ],
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsDisplayListComponent {
  @Input() requests!: any[];

  @Input() type!: string;
}
