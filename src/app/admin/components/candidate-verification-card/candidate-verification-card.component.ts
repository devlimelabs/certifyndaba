import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output
} from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule, Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HotToastService } from '@ngneat/hot-toast';
import {
  doc, Firestore, updateDoc
} from '@angular/fire/firestore';
import { CertificationNamePipe } from 'src/app/shared/certification-name/certification-name.pipe';
import {
  CertificationNumberInputComponent,
  CertificationType
} from 'src/app/shared/certification-number-input/certification-number-input.component';
import { DaysAgoPipe } from 'src/app/shared/days-ago/days-ago.pipe';
import { AuthService } from '~auth/auth.service';

@Component({
  selector: 'app-candidate-verification-card',
  standalone: true,
  imports: [
    CertificationNamePipe,
    CertificationNumberInputComponent,
    CommonModule,
    DaysAgoPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule
  ],
  templateUrl: './candidate-verification-card.component.html',
  styleUrls: [ './candidate-verification-card.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateVerificationCardComponent {

  private firestore = inject(Firestore);
  private authSvc = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(HotToastService);

  @Input() candidate!: any;
  @Output() verificationStatusUpdate = new EventEmitter<void>();

  verificationForm = this.fb.group({
    originalCertificationDate: [ '', Validators.required ],
    certificationExpirationDate: [ '', Validators.required ],
    certificationNumber:  [ '', Validators.required ],
    rejectionReason: [ '' ]
  });

  get experienceLevel(): CertificationType {
    return this.candidate.experienceLevel as CertificationType;
  }

  async markAsVerified(): Promise<void> {
    let { originalCertificationDate, certificationExpirationDate } = this.verificationForm.value;

    if (originalCertificationDate && certificationExpirationDate) {

      if (isNaN(Date.parse(originalCertificationDate))) {
        this.toast.warning('Original Certification Date Provided is Invalid. Please check the date & try again');
        return;
      }

      if (isNaN(Date.parse(certificationExpirationDate))) {
        this.toast.warning('Certification Expiration Date Provided is Invalid. Please check the date & try again');
        return;
      }

    } else if ([ 'NONE','BT' ].includes(this.candidate?.experienceLevel ?? '')) {
      originalCertificationDate = 'N/A';
      certificationExpirationDate = 'N/A';
    } else {
      this.toast.warning('Provide Original Certification Date & Expirtion Date to Approve Verification!');
      return;
    }

    try {
      const usersRef = doc(this.firestore, `users/${this.candidate.id}`);
      const user = await updateDoc(usersRef, {
        id: this.candidate.id,
        originalCertificationDate,
        certificationExpirationDate,
        rejectionReason: null,
        status: 'verified',
        verifiedBy: this.authSvc.$user()?.uid,
        verifiedOn: new Date().toISOString()
      });

      this.verificationStatusUpdate.emit();

      this.toast.success(`Verification for ${this.candidate.firstName} ${this.candidate.lastName} has been Approved!`);
    } catch (err) {
      this.toast.error('Error updating candidates verification status! If issue persists contact application support.');
      return;
    }
  }

  async rejectVerification(): Promise<void> {
    const { rejectionReason } = this.verificationForm.value;

    if (!rejectionReason) {
      this.toast.error('You must provide a rejection reason to reject verification. The provided rejection reason will be sent to the candidate so they can attempt to correct the issue. Please keep that in mind while writing it.', {
        duration: 6000,
        dismissible: true
      });
      return;
    }

    try {
      const usersRef = doc(this.firestore, `users/${this.candidate.id}`);
      const user = await updateDoc(usersRef, {
        id: this.candidate.id,
        rejectionReason: null,
        status: 'verified',
        verifiedBy: this.authSvc.$user()?.uid,
        verifiedOn: new Date().toISOString()
      });

      this.verificationStatusUpdate.emit();

      this.toast.success(`Verification for ${this.candidate.firstName} ${this.candidate.lastName} has been Rejected!`);
    } catch (err) {
      this.toast.error('Error updating candidates verification status! If issue persists contact application support.');
      return;
    }
  }
}
