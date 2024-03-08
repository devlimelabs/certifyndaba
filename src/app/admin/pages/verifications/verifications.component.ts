import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { showHideVertical } from 'src/app/animations/show-hide-vertical';
import { CertificationNamePipe } from 'src/app/shared/certification-name/certification-name.pipe';

import {
  CandidateVerificationCardComponent
} from '../../components/candidate-verification-card/candidate-verification-card.component';
import {
  collection, Firestore, getDocs, orderBy, query, where
} from '@angular/fire/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CandidateVerificationCardComponent,
    CertificationNamePipe,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ScrollingModule
  ],
  templateUrl: './verifications.component.html',
  styleUrls: [ './verifications.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ showHideVertical() ]
})
export class VerificationsComponent implements OnInit {

  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private loading = new BehaviorSubject<boolean>(true);
  private route = inject(ActivatedRoute);

  readonly loading$ = this.loading.asObservable();

  @ViewChild('verificationsContainer') verificationsContainer!: ElementRef;

  candidates: any[] = [];

  showProcess = true;

  ngOnInit() {
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ unverifiedCandidates }) => {
        this.candidates = unverifiedCandidates;
        this.loading.next(false);
      });
  }

  async refreshCandidates(): Promise<void> {
    this.loading.next(true);
    const unverifiedUsersSnapshot = await getDocs(
      query(
        collection(this.firestore, `users`),
        where('status', '==', 'unverified'),
        orderBy('createdAt', 'desc')
      )
    );

    const unverifiedUsers: any[] = [];

    unverifiedUsersSnapshot.forEach((doc: any) => {
      unverifiedUsers.push({
        id: doc.id,
        ...doc.data()
      });
    });

    this.candidates = unverifiedUsers;
    this.verificationsContainer.nativeElement.scrollTo(0,0);
    this.loading.next(false);
  }

  toggleProcess(): void {
    this.showProcess = !this.showProcess;
    this.cdr.markForCheck();
  }
}
