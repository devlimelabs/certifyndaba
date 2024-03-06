import { of } from 'rxjs';

export const ConfirmServiceStub = {
  confirm: (confirmAction: string, title?: string) => of(true)
};
