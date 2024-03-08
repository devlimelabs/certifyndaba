import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, inject 
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-request-response',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './confirm-request-response.component.html',
  styleUrls: [ './confirm-request-response.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmRequestResponseComponent {

  public data = inject(MAT_DIALOG_DATA);

}
