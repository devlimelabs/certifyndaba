import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, inject
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HotToastService } from '@ngneat/hot-toast';

import { firstValueFrom } from 'rxjs';
import { AvailabilityPipe } from 'src/app/shared/availability/availability.pipe';
import { CertificationNamePipe } from 'src/app/shared/certification-name/certification-name.pipe';
import { DaysAgoPipe } from 'src/app/shared/days-ago/days-ago.pipe';

import { ConnectDialogComponent } from '../connect-dialog/connect-dialog.component';
import { input } from '@angular/core';
import { computed } from '@angular/core';
import { ClientPopulation } from '~models/client-population';
import { TherapyEnvironment } from '~models/therapy-environment';
import {
  Firestore, addDoc, collection
} from '@angular/fire/firestore';
import { Candidate } from '~models/candidate';
import { Company } from '~models/company';
import { AuthStore } from '~auth/state/auth.store';


@Component({
  selector: 'app-candidate-search-card',
  standalone: true,
  imports: [
    AvailabilityPipe,
    CertificationNamePipe,
    CommonModule,
    ConnectDialogComponent,
    DaysAgoPipe,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './candidate-search-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateSearchCardComponent {

  private authStore = inject(AuthStore);
  private firestore = inject(Firestore);
  private dialog = inject(MatDialog);
  private toast = inject(HotToastService);

  candidate = input<Candidate|undefined>();
  company = input<Company|null>(null);
  showConnect = input<boolean>(true);

  requestPending = computed(() => this.company()?.pendingCandidates?.includes(this.candidate()?.id ?? ''));
  requestRejected = computed(() => this.company()?.rejectedCandidates?.includes(this.candidate()?.id ?? ''));
  candidateConnected = computed(() => this.company()?.connectedCandidates?.includes(this.candidate()?.id ?? ''));

  clientPopulations = ClientPopulation;
  therapyEnvironment = TherapyEnvironment;

  async connect(): Promise<void> {
    const connectionRequest = await firstValueFrom(this.dialog.open(ConnectDialogComponent, {
      maxWidth: '700px',
      data: {
        candidate: this.candidate(),
        company: this.company()
      }
    }).afterClosed());

    if (connectionRequest) {
      try {
        console.log('`companies/${this.authStore.companyID()}/requests`', `companies/${this.authStore.companyID()}/requests`);
        const requestRef = collection(this.firestore, `companies/${this.authStore.companyID()}/requests`);
        console.log('requestRef', requestRef);
        const request = await addDoc(requestRef, connectionRequest);
        console.log('Connection request sent:', request.id);
        this.toast.success('Connection request sent!');
      } catch (err) {
        this.toast.error('There was an error sending the connection request, please try again later');
      }
    }
  }

}
