import { RequestStatus } from './request-status';

export type Request = {
  id: string;
  address?: string | null;
  candidateID: string;
  city?: string | null;
  clinicID?: string | null;
  companyID: string;
  companyGroupID: string;
  description?: string | null;
  employmentType?: string;
  jobTitle?: string;
  location?: string | null;
  salary?: string | null;
  startTimeFrame?: string | null;
  state?: string | null;
  status: RequestStatus;
  title?: string | null;
  zip?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
