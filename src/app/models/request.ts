import { Candidate } from './candidate';
import { RequestStatus } from './request-status';

export type Request = {
  id: string;
  address?: string | null;
  candidateID: string;
  candidate?: Candidate;
  city?: string | null;
  clinicID?: string | null;
  companyID: string;
  companyGroupID: string;
  location?: string | null;
  description?: string | null;
  salary?: string | null;
  startTimeFrame?: string | null;
  state?: string | null;
  status: RequestStatus;
  title?: string | null;
  zip?: string | null;
  createdAt: string;
  updatedAt: string;
};
