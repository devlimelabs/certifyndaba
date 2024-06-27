import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy } from '@ngneat/until-destroy';
import { lastValueFrom } from 'rxjs';

import { ConfirmRequestResponseComponent } from './confirm-request-response/confirm-request-response.component';
import { SanitizePipe } from 'src/app/shared/sanitize.pipe';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  doc, Firestore, updateDoc
} from '@angular/fire/firestore';
import { ImageComponent } from '~shared/image/image.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Company } from '~models/company';
import { Request } from 'src/app/models/request';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    EditorModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ImageComponent,
    SanitizePipe
  ],
  templateUrl: './request-detail.component.html'
})
export class RequestDetailComponent {

  private firestore = inject(Firestore);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(HotToastService);

  company = input<Company>();
  request = input<Request>();

  isAccepted = computed(() => this.request()?.status === 'Accepted');

  statusClasses = computed(() => {
    const classMap = {
      'Pending': 'bg-blue-100 border-blue-800 text-blue-800',
      'Accepted':'bg-green-50 border-green-500 text-green-600',
      'Rejected': 'bg-red-50 border-red-500 text-red-600'
    };

    const status = this.request()?.status ?? 'Pending';

    return classMap[status];
  });

  statusIcon = computed(() => {
    const iconMap = {
      'Pending': 'schedule',
      'Accepted': 'check',
      'Rejected': 'close'
    };

    const status = this.request()?.status ?? 'Pending';

    return iconMap[status];
  });

  async acceptRequest(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmRequestResponseComponent, {
      data: {
        responseAction: 'Accept'
      }
    });

    const acceptConfirmed = await lastValueFrom(dialogRef.afterClosed());

    if (acceptConfirmed) {
      try {
        const requestRef = doc(this.firestore, `requests/${this.request()?.id}`);

        const request = await updateDoc(requestRef, {
          status: 'Accepted'
        });

        this.toast.success('Connection Request Accepted!');

        this.router.navigateByUrl('/app/candidate/requests');
      } catch (err) {
        this.toast.error('There was an issue accepting the request. Try again and if issues persist contact support');
      }
    }
  }

  async rejectRequest(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmRequestResponseComponent, {
      data: {
        responseAction: 'Reject'
      }
    });

    const rejectConfirmed = await lastValueFrom(dialogRef.afterClosed());

    if (rejectConfirmed) {
      try {
        const requestRef = doc(this.firestore, `requests/${this.request()?.id}`);

        const request = await updateDoc(requestRef, {
          status: 'Rejected'
        });

        this.toast.success('Connection Request Rejected!');

        this.router.navigateByUrl('/app/candidate/requests');
      } catch (err) {
        this.toast.error('There was an issue rejecting the request. Try again and if issues persist contact support');
      }
    }
  }
}
