import { CommonModule } from '@angular/common';
import {
  Component, inject, OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Request } from 'src/app/models/request';
import { CertificationNamePipe } from 'src/app/shared/certification-name/certification-name.pipe';
import { SanitizePipe } from 'src/app/shared/sanitize.pipe';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    CertificationNamePipe,
    CommonModule,
    MatButtonModule,
    SanitizePipe
  ],
  templateUrl: './company-request-detail.component.html'
})
export class CompanyRequestDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);

  request!: Request;

  ngOnInit() {
    this.route.data
      .pipe(untilDestroyed(this))
      .subscribe(({ request }) => {
        this.request = request;
      });
  }

  async acceptRequest(): Promise<void> {

  }

  async rejectRequest(): Promise<void> {

  }
}
