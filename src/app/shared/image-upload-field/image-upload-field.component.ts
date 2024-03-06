import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, WritableSignal, computed, inject, signal
} from '@angular/core';
import { ValueAccessorDirective } from '../value-accessor/value-accessor.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { S3ImageComponent } from '../s3-image/s3-image.component';
import last from 'lodash/last';
import head from 'lodash/head';
import { HotToastService } from '@ngneat/hot-toast';
import { uploadData } from '@aws-amplify/storage';

@Component({
  selector: 'app-image-upload-field',
  standalone: true,
  imports: [ CommonModule, S3ImageComponent ],
  templateUrl: './image-upload-field.component.html',
  styleUrl: './image-upload-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ ValueAccessorDirective ]
})
export class ImageUploadFieldComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private toast = inject(HotToastService);
  private valueAccessor = inject(ValueAccessorDirective<string>);

  @Input({ required: true }) accountID!: string;

  @Input({ required: true }) accountType!: string;

  @Input({ required: true }) label!: string;

  fileName = computed(() => last(this.value()?.split('/')) ?? '');

  showInput = signal(true);

  uploading = signal(false);

  uploadPercent = computed(() => Math.round(this.uploadProgress() / this.uploadTotal()));

  uploadProgress = signal(0);

  uploadTotal = signal(0);

  value: WritableSignal<string> = signal('');

  ngOnInit() {
    this.valueAccessor.value
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.value.set(value);

        if (value !== null) {
          this.showInput.set(false);
        }
      });
  }

  toggleShowInput() : void {
    this.showInput.set(!this.showInput());
  }

  async onFileSelected(event: any) {
    const file: any = head(event?.target?.files);

    if (file) {
      this.uploading.set(true);
      const loading = this.toast.loading('Uploading file...');

      try {
        const fileName = `${head(file.name.split('.'))}.${last(file.name.split('.'))}`;
        const upload = await uploadData({
          key: fileName,
          data: file,
          options: {
            accessLevel: 'protected',
            onProgress: this.progress.bind(this)
          }
        }).result;

        if (upload) {
          this.valueAccessor.valueChange(upload.key);
          this.valueAccessor.touchedChange(true);
        }

        this.showInput.set(false);
        this.uploading.set(false);
        loading.close();
      } catch (error) {
        this.uploading.set(false);
        loading.close();
        this.toast.error('Error uploading profile image. Please make sure the file is valid & try again.');
        console.error("Error uploading file: ", error);
      }
    }

  }

  progress(e: any) : void {
    this.uploadProgress.set(+e?.loaded);
    this.uploadTotal.set(+e?.total);
  }
}
