import {
  Component, OnInit, ViewEncapsulation, inject, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './careers.component.html',
  styleUrls: [ './careers.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class CareersComponent implements OnInit {

  private route = inject(ActivatedRoute);

  careerPage = signal<any>(null);

  ngOnInit(): void {
    this.route.data
      .pipe(untilDestroyed(this))
      .subscribe(({ careerPage }) => this.careerPage.set(careerPage.data));
  }

}
