import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(
    private dialog: MatDialog
  ) { }

  confirm(confirmAction: string, title?: string, config?: any): Observable<boolean> {
    const dialogOptions = {
      width: '550px',
      hasBackdrop: true,
      autoFocus: true,
      data: {
        confirmAction,
        confirmText: 'Confirm',
        showCancel: true,
        showTitle: true,
        title: title || 'Delete?',
        ...(config || {})
      }
    };

    return this.dialog.open(ConfirmModalComponent, dialogOptions)
      .afterClosed();
  }
}
