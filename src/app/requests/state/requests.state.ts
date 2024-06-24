import { signalStore, withState } from '@ngrx/signals';

type RequestsState = {
  backToListLink: string;
  requestPageTitle: string;
  showBackToList: boolean;
  showRequestButton: boolean;
};

const initialState: RequestsState = {
  backToListLink: '../',
  requestPageTitle: 'Connection Requests',
  showBackToList: false,
  showRequestButton: false
};

export const RequestsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState)
);
