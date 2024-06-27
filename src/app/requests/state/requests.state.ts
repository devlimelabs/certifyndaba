import { signalStore, withState } from '@ngrx/signals';

type RequestsState = {
  backToListLink: string;
  backToListText: string;
  requestPageTitle: string;
  showBackToList: boolean;
  showRequestButton: boolean;
};

const initialState: RequestsState = {
  backToListLink: '../',
  backToListText: 'Back to Requests',
  requestPageTitle: 'Connection Requests',
  showBackToList: false,
  showRequestButton: false
};

export const RequestsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState)
);
