import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation 
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ValueAccessorDirective } from 'src/app/shared/value-accessor/value-accessor.directive';
import { STATES } from '~constants/states';

@UntilDestroy()
@Component({
  selector: 'app-state-selector',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './state-selector.component.html',
  styleUrls: [ './state-selector.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ ValueAccessorDirective ],
  encapsulation: ViewEncapsulation.None
})
export class StateSelectorComponent implements OnInit {

  private valueAccessor = inject(ValueAccessorDirective<string[]>);

  readonly states = STATES;

  value: string[] = [];

  ngOnInit() {
    this.valueAccessor.value
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.value = value ?? [];
      });
  }

  selectChange(selectChange: MatSelectChange): void {
    this.valueAccessor.valueChange(selectChange.value);
    this.valueAccessor.touchedChange(true);
  }

}
