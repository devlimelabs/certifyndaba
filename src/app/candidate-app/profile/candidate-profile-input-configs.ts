import { Validators } from '@angular/forms';
import {
  HtmlInputAutocomplete, HtmlInputType, InputConfig
} from 'src/app/forms/forms';
import { EXPERIENCE_LEVELS } from '../../constants/experience-levels';
import { STATES } from '~constants/states';
import { START_DATES } from '~constants/start-dates';
import { CLIENT_POPULATIONS } from '~constants/client-populations';
import { EMPLOYMENT_TYPES } from '~constants/employment-types';
import { WORK_ENVIRONMENTS } from '~constants/work-environments';
import { AVAILABILITIES } from '~constants/availabilities';

export const CANDIDATE_PROFILE_INPUT_CONFIGS: Partial<InputConfig>[] = [
  {
    autocomplete: HtmlInputAutocomplete.GivenName,
    class: 'sm:col-span-3',
    formControlName: 'firstName',
    section: 'required-info',
    suffixIcon: 'shield_check',
    suffixIconClass: '!text-blue-400 !text-lg',
    suffixTooltip: 'Your first name will NOT be displayed publicly.',
    required: true,
    validators: [ Validators.required ]
  },
  {
    autocomplete: HtmlInputAutocomplete.FamilyName,
    class: 'sm:col-span-3',
    suffixTooltip: 'Your last name will NOT be displayed publicly.',
    formControlName: 'lastName',
    required: true,
    section: 'required-info',
    suffixIcon: 'shield_check',
    suffixIconClass: '!text-blue-400 !text-lg',
    validators: [ Validators.required ]
  },
  {
    autocomplete: HtmlInputAutocomplete.Email,
    class: 'sm:col-span-3',
    formControlName: 'email',
    label: 'Email Address',
    section: 'required-info',
    suffixTooltip: 'Your email will NOT be displayed publicly.',
    suffixIcon: 'shield_check',
    suffixIconClass: '!text-blue-400 !text-lg',
    type: HtmlInputType.Email,
    validators: [ Validators.required ]
  },
  {
    autocomplete: HtmlInputAutocomplete.Tel,
    class: 'sm:col-span-3',
    formControlName: 'phone',
    label: 'Phone Number',
    required: true,
    section: 'required-info',
    suffixIcon: 'shield_check',
    suffixIconClass: '!text-blue-400 !text-lg',
    suffixTooltip: 'Your phone number will NOT be displayed publicly.',
    validators: [ Validators.required ]
  },
  {
    autocomplete: HtmlInputAutocomplete.AddressLine1,
    label: 'Address / Location',
    name: 'street-address',
    formControlName: 'address',
    section: 'required-info',
    template: 'location-search'
  },
  {
    class: 'sm:col-span-full',
    label: 'Level of Experience',
    formControlName: 'experienceLevel',
    validators: [ Validators.required ],
    section: 'required-info',
    template: 'select',
    options: EXPERIENCE_LEVELS
  },
  {
    class: 'col-span-full',
    label: 'Certification Number',
    formControlName: 'certificationNumber',
    hint: 'Your certification number will NOT be displayed publicly.',
    section: 'required-info',
    template: 'certification-number'
  },
  {
    class: 'sm:col-span-2',
    formControlName: 'yearsOfExperience',
    section: 'required-info',
    type: HtmlInputType.Number,
    min: 0,
    max: 100
  },
  {
    class: 'sm:col-span-3',
    label: 'Availability',
    formControlName: 'availabilityStatus',
    section: 'experience-profile',
    template: 'select',
    options: AVAILABILITIES
  },
  {
    class: 'sm:col-span-2',
    label: 'Minimum Salary',
    formControlName: 'salary',
    prefixIcon: 'attach_money',
    section: 'experience-profile',
    type: HtmlInputType.Number
  },
  {
    label: 'Start Date',
    formControlName: 'startDate',
    section: 'experience-profile',
    template: 'select',
    options: START_DATES
  },
  {
    class: 'sm:col-span-2',
    formControlName: 'clientPopulations',
    section: 'experience-profile',
    template: 'select',
    multi: true,
    options: CLIENT_POPULATIONS
  },
  {
    class: 'sm:col-span-2',
    formControlName: 'employmentTypes',
    section: 'experience-profile',
    template: 'select',
    multi: true,
    options: EMPLOYMENT_TYPES
  },
  {
    label: 'Work Environments',
    class: 'sm:col-span-2',
    formControlName: 'environments',
    section: 'experience-profile',
    template: 'select',
    multi: true,
    options: WORK_ENVIRONMENTS
  },

  {
    class: 'sm:col-span-2',
    label: 'Are You Willing to Relocate?',
    formControlName: 'relocation',
    section: 'experience-profile',
    template: 'select',
    options: [
      {
        label: 'Yes',
        value: true
      },
      {
        label: 'No',
        value: false
      }
    ]
  },
  {
    class: 'sm:col-span-3',
    conditional: (form: any) => form.relocation === true,
    formControlName: 'locationsOfInterest',
    section: 'experience-profile',
    template: 'select',
    options: STATES,
    multi: true
  },
  {
    formControlName: 'about',
    hint: `Just remember this section is public, so don't include any personal identifiable information like name or contact info.`,
    placeholder: `Write a few sentences about yourself, or what you are looking for in an opportunity. You can use this section to stand out by adding any personal accomplishments or traits.`,
    section: 'experience-profile',
    template: 'textarea',
    rows: 5
  },
  // {
  //   autocomplete: HtmlInputAutocomplete.AddressLine2,
  //   label: 'Apt / Suite / Other',
  //   name: 'street-address2',
  //   formControlName: 'address2'
  // },
  // {
  //   class: 'sm:col-span-2',
  //   label: 'city',
  //   formControlName: 'city',
  //   autocomplete: HtmlInputAutocomplete.AddressLevel2
  // },
  // {
  //   autocomplete: HtmlInputAutocomplete.AddressLevel1,
  //   class: 'sm:col-span-2',
  //   label: 'State / Province',
  //   formControlName: 'state',
  //   template: 'select',
  //   options: STATES
  // },
  // {
  //   class: 'sm:col-span-2',
  //   autocomplete: HtmlInputAutocomplete.PostalCode,
  //   formControlName: 'zip'
  // },
  // {
  //   autocomplete: HtmlInputAutocomplete.Country,
  //   formControlName: 'country',
  //   template: 'select',
  //   options: [
  //     {
  //       label: 'United States',
  //       value: 'US'
  //     },
  //     {
  //       label: 'Canada',
  //       value: 'CA'
  //     },
  //     {
  //       label: 'Mexico',
  //       value: 'MX'
  //     },
  //     {
  //       label: 'Other',
  //       value: 'OTHER'
  //     }
  //   ]
  // },
  {
    autocomplete: HtmlInputAutocomplete.Organization,
    label: 'Current Employer',
    section: 'current-employer',
    formControlName: 'employer'
  },
  {
    autocomplete: HtmlInputAutocomplete.OrganizationTitle,
    formControlName: 'position',
    label: 'Current Position',
    section: 'current-employer'
  },
  {
    formControlName: 'lengthOfEmployment',
    section: 'current-employer',
    type: HtmlInputType.Number
  },
  {
    formControlName: 'linkedInProfileUrl',
    hint: 'Your LinkedIn profile url will not be displayed publicly.',
    label: 'LinkedIn Profile URL',
    section: 'current-employer'
  }
];
