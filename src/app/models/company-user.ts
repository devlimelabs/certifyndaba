export type CompanyUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  position?: string | null;
  companyID: string;
  companyAdmin?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  owner?: string | null;
};
