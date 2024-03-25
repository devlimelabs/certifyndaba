import {
  AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';
import filter from 'lodash/filter';

export const identityRevealedValidator: ValidatorFn = (profileForm: AbstractControl): ValidationErrors | null => {
  let errors: any = null;

  const personalInfoFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'linkedInProfileUrl'
  ];

  const about = profileForm.get('about');

  const matchingFields = filter(personalInfoFields, (field: string) => {
    const fieldValue = profileForm?.get(field)?.value?.toLowerCase();

    return fieldValue?.length && about?.value?.toLowerCase()?.includes(fieldValue);
  });


  if (matchingFields.length > 0) {
    errors = { identityRevealed: true };

    for (let field of matchingFields) {
      errors[field as string] = true;
    }
  }

  return errors;
};
