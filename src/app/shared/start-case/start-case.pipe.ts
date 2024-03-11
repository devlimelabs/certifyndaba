import { Pipe, PipeTransform } from '@angular/core';
import startCase from 'lodash/startCase';

@Pipe({
  name: 'startCase',
  standalone: true
})
export class StartCasePipe implements PipeTransform {

  transform(value: string): string {
    return startCase(value);
  }

}
