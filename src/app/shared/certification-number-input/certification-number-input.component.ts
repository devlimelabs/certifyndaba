import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ValueAccessorDirective } from '../value-accessor/value-accessor.directive';

export type CertificationType = 'RBT' | 'BCaBA' | 'BCBA' | 'BCBAD';
@UntilDestroy()
@Component({
  selector: 'app-certification-number-input',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './certification-number-input.component.html',
  styleUrls: [ './certification-number-input.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ ValueAccessorDirective ]
})
export class CertificationNumberInputComponent implements OnInit, OnChanges {

  private cdr = inject(ChangeDetectorRef);
  private valueAccessor = inject(ValueAccessorDirective<string>);

  readonly certPrefixMap = {
    RBT: 'RBT',
    BCaBA: '0',
    BCBA: '1',
    BCBAD: '1'
  };

  @Input() showLabel = true;
  @Input() type!: CertificationType;

  get certPrefix(): string {
    return this.certPrefixMap?.[this.type] ?? '';
  }
  certNumber1 = '';
  certNumber2 = '';

  value = '';

  ngOnInit() {
    this.valueAccessor.value
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.value = value ?? '';
        const [
          certPrefix,
          certNumber1 = '',
          certNumber2 = ''
        ] = this.value.split('-');

        this.certNumber1 = certNumber1;
        this.certNumber2 = certNumber2;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['type'] && !changes['type'].firstChange) {
      this.emitValueChange();
    }
  }

  certNumber1Change(e: any): void {
    this.certNumber1 = e.target.value;
    this.emitValueChange();
  }

  certNumber2Change(e: any): void {
    this.certNumber2 = e.target.value;
    this.emitValueChange();
  }

  private emitValueChange():void {
    this.valueAccessor.valueChange(`${this.certPrefix}-${this.certNumber1}-${this.certNumber2}`);
    this.valueAccessor.touchedChange(true);
  }


}
