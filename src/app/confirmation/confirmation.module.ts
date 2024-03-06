import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [ ConfirmModalComponent ],
  exports: [ ConfirmModalComponent ],
  imports: [ CommonModule, MatDialogModule ]
})
export class ConfirmationModule { }
