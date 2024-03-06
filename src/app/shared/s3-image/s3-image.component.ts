import { CommonModule } from '@angular/common';
import { downloadData } from '@aws-amplify/storage';
import {
  ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, WritableSignal, signal
} from '@angular/core';

@Component({
  selector: 'app-s3-image',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './s3-image.component.html',
  styleUrl: './s3-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class S3ImageComponent implements OnChanges {

  @Input() imageKey?: string | undefined | null;

  @Input() imageDataUrl?: string | undefined;

  @Input() width: string | null = null;

  imageData: WritableSignal<string | null> = signal(null);

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['imageKey'] && this.imageKey) {
      const imageData = await this.getImageDataUrl(this.imageKey);
      this.imageData.set(imageData);
    } else if (changes['imageDataUrl'] && this.imageDataUrl) {
      this.imageData.set(this.imageDataUrl);
    }
  }

  private async getImageDataUrl(imageKey: string): Promise<any> {
    const blob = (await downloadData({ key: imageKey }).result)?.body;
    const reader: any = new FileReader();

    reader.readAsDataURL(blob);

    const imageData: any = await new Promise((resolve, reject) => {
      reader.onload = function () {
        let image = new Image();

        image.src = reader.result as string;

        image.onload = () => {
          const height = this.height;
          const width = this.width;

          resolve({
            height,
            width,
            imageUrl: reader.result
          });
        };

        image.onerror = reject;
      };
    });

    const { imageUrl, width } = await imageData;

    if (!this.width) {
      this.width = width;
    }

    return imageUrl;
  }
}
