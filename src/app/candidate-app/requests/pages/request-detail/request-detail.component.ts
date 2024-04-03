import { CommonModule } from '@angular/common';
import {
  Component, inject, OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { lastValueFrom } from 'rxjs';

import { ConfirmRequestResponseComponent } from './confirm-request-response/confirm-request-response.component';
import { SanitizePipe } from 'src/app/shared/sanitize.pipe';
import { EditorModule } from '@tinymce/tinymce-angular';
import {
  doc, Firestore, updateDoc
} from '@angular/fire/firestore';
import { ImageComponent } from '~shared/image/image.component';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CommonModule,
    EditorModule,
    MatButtonModule,
    ImageComponent,
    SanitizePipe
  ],
  templateUrl: './request-detail.component.html'
})
export class RequestDetailComponent implements OnInit {

  private firestore = inject(Firestore);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(HotToastService);

  request!: any;

  ngOnInit() {
    this.route.data
      .pipe(untilDestroyed(this))
      .subscribe(({ request }) => {
        this.request = request;
      });
  }

  async acceptRequest(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmRequestResponseComponent, {
      data: {
        responseAction: 'Accept'
      }
    });

    const acceptConfirmed = await lastValueFrom(dialogRef.afterClosed());

    if (acceptConfirmed) {
      try {
        const requestRef = doc(this.firestore, `requests/${this.request.id}`);

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
        const requestRef = doc(this.firestore, `requests/${this.request.id}`);

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
