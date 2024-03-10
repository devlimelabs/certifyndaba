import map from 'lodash/map';
import { AVAILABILITIES } from 'src/app/constants/availabilities';
import { CERTIFICATIONS } from 'src/app/constants/certifications';
import { STATES } from '~constants/states';

export const FILTER_CATEGORIES = [
  {
    label: 'Certification',
    property: 'experienceLevel',
    options: map(CERTIFICATIONS, certification => ({
      ...certification,
      checked: false
    }))
  },
  {
    label: 'Availability',
    property: 'availabilityStatus',
    options: map(AVAILABILITIES, availability => ({
      ...availability,
      checked: false
    }))
  },
  {
    label: 'Location',
    property: 'locationsOfInterest',
    isArray: true,
    options: map([ ...STATES ], state => ({
      label: state,
      value: state,
      checked: false
    }))
  },
  {
    label: 'Client Populations',
    property: 'clientPopulations',
    isArray: true,
    options: [
      {
        checked: false,
        label: 'Children',
        value: 'Children'
      },
      {
        checked: false,
        label: 'Adolescents',
        value: 'Adolescents'
      },
      {
        checked: false,
        label: 'Adults',
        value: 'Adults'
      },
      {
        checked: false,
        label: 'Elderly',
        value: 'Elderly'
      }
    ]
  },
  {
    label: 'Therapy Environments',
    property: 'environments',
    isArray: true,
    options: [
      {
        checked: false,
        label: 'Clinic',
        value: 'clinic'
      },
      {
        checked: false,
        label: 'Home',
        value: 'home'
      },
      {
        checked: false,
        label: 'School',
        value: 'school'
      },
      {
        checked: false,
        label: 'Residence / Group Home',
        value: 'residence'
      },
      {
        checked: false,
        label: 'Other',
        value: 'other'
      }
    ]
  },
  {
    label: 'Employment Types',
    property: 'employmentTypes',
    isArray: true,
    options: [
      {
        checked: false,
        label: 'Full-Time',
        value: 'full-time'
      },
      {
        checked: false,
        label: 'Part-Time',
        value: 'part-time'
      },
      {
        checked: false,
        label: 'Contract',
        value: 'contract'
      },
      {
        checked: false,
        label: 'Internship',
        value: 'internship'
      },
      {
        checked: false,
        label: 'Temporary',
        value: 'temporary'
      }
    ]
  }
];
