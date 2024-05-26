import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input
} from '@angular/core';
import { InputConfig, inputConfig } from '../forms';
import { ValueAccessorDirective } from '~shared/value-accessor/value-accessor.directive';
import {
  FormControl, FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MultiCheckboxComponent } from '~shared/multi-checkbox/multi-checkbox.component';
import { TippyDirective } from '@ngneat/helipopper';

@Component({
  selector: 'app-input',
  standalone: true,
  hostDirectives: [ ValueAccessorDirective ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MultiCheckboxComponent,
    ReactiveFormsModule,
    TippyDirective
  ],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit {

  private valueAccessor = inject(ValueAccessorDirective<any>);
  private destroyRef = inject(DestroyRef);

  inputConfig = input<InputConfig>();

  inputCtrl = new FormControl();

  config = computed(() => inputConfig(this.inputConfig()));

  ngOnInit() {
    if (this.inputConfig()?.validators) {
      this.inputCtrl.setValidators(this.inputConfig()?.validators ?? []);
    }

    this.valueAccessor.value
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (value !== this.inputCtrl.value) {
          this.inputCtrl.patchValue(value ?? null);
        }
      });

    this.inputCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.updateValue(value));
  }

  updateValue(value: any): void {
    this.valueAccessor.valueChange(value);

    this.valueAccessor.touchedChange(true);
  }
}
