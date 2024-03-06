import { CommonModule } from '@angular/common';
import {
  Component, inject, Input, OnInit 
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import without from 'lodash/without';

import { ValueAccessorDirective } from '../value-accessor/value-accessor.directive';

@UntilDestroy()
@Component({
  selector: 'app-multi-checkbox',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './multi-checkbox.component.html',
  styleUrls: [ './multi-checkbox.component.scss' ],
  hostDirectives: [ ValueAccessorDirective ]
})
export class MultiCheckboxComponent implements OnInit {

  private valueAccessor = inject(ValueAccessorDirective<string[]>);

  @Input() description!: string;
  @Input() label!: string;
  @Input() name!: string;
  @Input() options!: { label: string; description?: string; value: any; }[];

  value: string[] = [];


  ngOnInit() {
    this.valueAccessor.value
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.value = value ?? [];
      });
  }

  checkboxChange(e: any): void {
    if (e.target.checked) {
      this.valueAccessor.valueChange([ ...this.value, e.target.value ]);
    } else {
      this.valueAccessor.valueChange(without(this.value, e.target.value));
    }

    this.valueAccessor.touchedChange(true);
  }
}
