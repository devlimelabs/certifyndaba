import { ValidatorFn } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import kebabCase from 'lodash/kebabCase';
import startCase from 'lodash/startCase';

export enum HtmlInputAutocomplete {
  AdditionalName = "additional-name",
  AddressLevel1 = "address-level1",
  AddressLevel2 = "address-level2",
  AddressLevel3 = "address-level3",
  AddressLevel4 = "address-level4",
  AddressLine1 = "address-line1",
  AddressLine2 = "address-line2",
  AddressLine3 = "address-line3",
  Bday = "bday",
  BdayDay = "bday-day",
  BdayMonth = "bday-month",
  BdayYear = "bday-year",
  CCAdditionalName = "cc-additional-name",
  CCCsc = "cc-csc",
  CCFamilyName = "cc-family-name",
  CCGivenName = "cc-given-name",
  CCName = "cc-name",
  CCNumber = "cc-number",
  CCExp = "cc-exp",
  CCExpMonth = "cc-exp-month",
  CCExpYear = "cc-exp-year",
  CCType = "cc-type",
  Country = "country",
  CountryName = "country-name",
  CurrentPassword = "current-password",
  Email = "email",
  FamilyName = "family-name",
  GivenName = "given-name",
  HonorificPrefix = "honorific-prefix",
  HonorificSuffix = "honorific-suffix",
  Impp = "impp",
  Language = "language",
  Name = "name",
  Nickname = "nickname",
  NewPassword = "new-password",
  On = "on",
  Off = "off",
  Organization = "organization",
  OrganizationTitle = "organization-title",
  Photo = "photo",
  PostalCode = "postal-code",
  Sex = "sex",
  StreetAddress = "street-address",
  Tel = "tel",
  TelAreaCode = "tel-area-code",
  TelCountryCode = "tel-country-code",
  TelExtension = "tel-extension",
  TelLocal = "tel-local",
  TelNational = "tel-national",
  TransactionAmount = "transaction-amount",
  TransactionCurrency = "transaction-currency",
  Url = "url",
  Username = "username",
  OneTimeCode = "one-time-code"
}

export enum HtmlInputType {
  Button = "button",
  Checkbox = "checkbox",
  Color = "color",
  Date = "date",
  DatetimeLocal = "datetime-local",
  Email = "email",
  File = "file",
  Hidden = "hidden",
  Image = "image",
  Month = "month",
  Number = "number",
  Password = "password",
  Radio = "radio",
  Range = "range",
  Reset = "reset",
  Search = "search",
  Submit = "submit",
  Tel = "tel",
  Text = "text",
  Time = "time",
  Url = "url",
  Week = "week"
}

export interface InputConfig {
  matAppearance: MatFormFieldAppearance;
  autocomplete?: HtmlInputAutocomplete;
  class: string;
  conditional?: (formValue: any) => boolean;
  formControlName: string;
  hint?: string;
  hintClass?: string;
  hintIcon?: string;
  label: string;
  max?: number;
  min?: number;
  multi?: boolean;
  name: string;
  options?: { label: string; value: any; description?: string; }[];
  order?: number;
  placeholder?: string;
  prefixIcon?: string;
  prefixText?: string;
  required?: boolean;
  rows?: number;
  section?: string;
  suffixIcon?: string;
  suffixIconClass?: string;
  suffixTooltip?: string;
  suffixText?: string;
  template: 'certification-number' | 'file' | 'input' | 'location-search' | 'multi-checkbox' | 'select' | 'textarea' ;
  type: HtmlInputType;
  validators?: ValidatorFn[];
}

export interface InputGroup {
  id: string;
  order: number;
  name?: string;
  description?: string;
  icon?: string;
  inputs?: InputConfig[];
  isOpen?: boolean;
  title?: string;
}

export function inputConfig(inputConfig: Partial<InputConfig> | undefined): InputConfig {
  const config = {
    matAppearance: 'outline',
    class: 'col-span-full',
    hintClass: '!text-blue-700',
    hintIcon: 'shield_check',
    template: 'input',
    type: HtmlInputType.Text,
    ...(inputConfig ?? {})
  };


  if (!config.name) {
    config.name = kebabCase(config.formControlName);
  }

  if (!config.label) {
    config.label = startCase(config.formControlName);
  }

  return config as InputConfig;
}
