import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, WritableSignal, inject, signal
} from '@angular/core';
import {
  getBlob, ref, Storage
} from '@angular/fire/storage';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnChanges {

  private storage = inject(Storage);

  @Input() imageKey?: string | undefined | null;

  @Input() imageDataUrl?: string | undefined;

  @Input() width: string | null = null;

  imageData: WritableSignal<string | null> = signal(null);

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['imageKey'] && this.imageKey) {
      // const imageData = await this.getImageDataUrl(this.imageKey);
      console.log(`https://images.certifyndaba.com/fit-in/${this.width}x0/${this.imageKey}`);
      this.imageData.set(`https://images.certifyndaba.com/fit-in/${this.width}x0/${this.imageKey}`);
    } else if (changes['imageDataUrl'] && this.imageDataUrl) {
      this.imageData.set(this.imageDataUrl);
    }
  }

  private async getImageDataUrl(imageKey: string): Promise<any> {
    const storageRef = ref(this.storage, imageKey);
    const blob = (await getBlob(storageRef));
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
