import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, inject, OnInit 
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ValueAccessorDirective } from 'src/app/shared/value-accessor/value-accessor.directive';

import { COMPANY_PLANS } from './company-plans';


@UntilDestroy()
@Component({
  selector: 'app-company-plan-options',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './company-plan-options.component.html',
  styleUrls: [ './company-plan-options.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ ValueAccessorDirective ]
})
export class CompanyPlanOptionsComponent implements OnInit {

  private valueAccessor = inject(ValueAccessorDirective<string>);

  readonly companyPlans = COMPANY_PLANS;

  value: string | undefined;


  ngOnInit() {
    this.valueAccessor.value
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.value = value;
      });
  }

  selectPlan(planID: string): void {
    this.valueAccessor.valueChange(planID);
    this.valueAccessor.touchedChange(true);
  }

}
