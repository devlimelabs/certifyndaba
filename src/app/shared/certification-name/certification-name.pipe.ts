import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'certificationName',
  standalone: true
})
export class CertificationNamePipe implements PipeTransform {

  readonly certificationNameMap: any = {
    NONE: 'Inexperienced Behavioral Therapist',
    BT: 'Behavioral Therapist (Uncertified)',
    RBT: 'Registered Behavioral Therapist (RBT)',
    BCaBA: 'Board Certified Assistant Behavioral Analyst (BCaBA)',
    BCBA: 'Board Certified Behavioral Analyst (BCBA)',
    BCBAD: 'Board Certified Behavioral Analyst Doctoral (BCBA-D)'
  };

  transform(certification: any): string {
    return this.certificationNameMap[certification];
  }

}
