import { ClientPopulation } from './client-population';
import { TherapyEnvironment } from './therapy-environment';

export type SearchCandidate = {
  id: string;
  about?: string;
  availabilityStatus?: string;
  city?: string;
  clientPopulations?: ClientPopulation[];
  country?: string;
  employmentTypes?: string[];
  environments?: TherapyEnvironment[];
  experienceLevel?: string;
  lastLogin: string;
  locationsOfInterest?: string[];
  originalCertificationDate?: string;
  certifiedSince?: number;
  position?: string;
  relocation?: boolean;
  salary?: string;
  startDate?: string;
  state?: string;
  verifiedOn?: string;
  yearsOfExperience?: string;
};


