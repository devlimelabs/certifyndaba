import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit 
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CertificationNamePipe } from 'src/app/shared/certification-name/certification-name.pipe';
import { DaysAgoPipe } from 'src/app/shared/days-ago/days-ago.pipe';

@Component({
  selector: 'app-company-requests-display-list',
  templateUrl: './company-requests-display-list.component.html',
  styleUrls: [ './company-requests-display-list.component.scss' ],
  standalone: true,
  imports: [
    CertificationNamePipe,
    CommonModule,
    DaysAgoPipe,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyRequestsDisplayListComponent implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  private router = inject(ActivatedRoute);
  requests: any[] =[];

  type!: string;

  ngOnInit() {
    this.router.data.subscribe(({ requests }) => {
      this.requests = requests;
      this.type = this.router.snapshot.params['type'];
      this.cdr.markForCheck();
    });
  }
}
