import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'availability',
  standalone: true
})
export class AvailabilityPipe implements PipeTransform {
  readonly availabilityMap: any = {
    active: 'Actively Looking',
    open: 'Open to Opportunities',
    curious: 'Just Curious'
  };

  transform(availability: any): string {
    return this.availabilityMap?.[availability] ?? '';
  }

}
