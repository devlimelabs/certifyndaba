import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, OnInit
} from '@angular/core';
import {
  FormBuilder, FormControl, ReactiveFormsModule, Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA, MatDialogModule, MatDialogRef
} from '@angular/material/dialog';
import { STATES } from '~constants/states';

import { CandidateListItemComponent } from '../candidate-list-item/candidate-list-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import omit from 'lodash/omit';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';


@Component({
  selector: 'app-connect-dialog',
  standalone: true,
  imports: [
    forwardRef(() => CandidateListItemComponent),
    CommonModule,
    EditorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSliderModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.min.js'
    }
  ],
  templateUrl: './connect-dialog.component.html',
  styleUrls: [ './connect-dialog.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectDialogComponent implements OnInit {

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(MatDialogRef<ConnectDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  cacheSub: Subscription | undefined | null;
  saveFormCtrl = new FormControl(false);

  readonly states = STATES;

  companyUser!: any;

  connectionForm = this.fb.group({
    candidateID: this.data.candidate.id,
    companyName: this.data.company.name,
    companyID: '',
    companyGroupID: '',
    createdAt: new Date().toISOString(),
    address: [ '', Validators.required ],
    city: [ '', Validators.required ],
    state: [ '', Validators.required ],
    zip: [ '', Validators.required ],
    description: [ '', Validators.required ],
    salary: [ '$100000', Validators.required ],
    startTimeFrame: [ '', Validators.required ],
    title: [ '', Validators.required ],
    status: 'Pending'
  });

  get descCtrl(): FormControl {
    return this.connectionForm.get('description') as FormControl;
  }

  get salaryCtrl () {
    return this.connectionForm.get('salary') as FormControl;
  }

  // get salaryStart(): number {
  //   return +(this.salaryCtrl.value?.split(' - ')?.[0]?.trim('$') ?? 10000);
  // }

  // get salaryEnd(): number {
  //   return +(this.salaryCtrl.value?.split(' - ')?.[1]?.trim('$') ?? 50000);
  // }

  async ngOnInit(): Promise<void> {
    this.connectionForm.patchValue({
      companyID: this.data.company.id,
      companyGroupID: this.data.company.groupID,
      address: `${this.data.company.address1} ${this.data.company?.address2 ?? ''}`.trim(),
      city: this.data.company.city,
      state: this.data.company.state,
      zip: this.data.company.zip,
      candidateID: this.data.candidate.id
    });

    const cachedConnectionForm = localStorage.getItem('connectionForm');

    if (cachedConnectionForm) {
      this.saveFormCtrl.setValue(true);

      const data = omit(JSON.parse(cachedConnectionForm), 'candidateID');

      this.connectionForm.patchValue(data);
    }

    this.saveFormCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(save => {
        if (save) {
          this.saveFormChanges();
        } else {
          localStorage.removeItem('connectionForm');

          if (this.cacheSub) {
            this.cacheSub.unsubscribe();
            this.cacheSub = null;
          }
        }
      });
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  saveFormChanges(): void {
    localStorage.setItem('connectionForm', JSON.stringify(omit(this.connectionForm.value, 'candidateID')));

    this.cacheSub = this.connectionForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(connectionForm => {
        localStorage.setItem('connectionForm', JSON.stringify(omit(connectionForm, 'candidateID')));
      });
  }

  // setStartingSalary(value: any): void {
  //   this.salaryCtrl.patchValue(`$${value} - ${this.salaryEnd}`);
  // }

  // setEndingSalary(value: any): void {
  //   this.salaryCtrl.patchValue(`${this.salaryCtrl.value.split(' - ')?.[0]} - ${value}`);
  // }

  submitRequest(): void {
    this.dialogRef.close(this.connectionForm.value);
  }

}
