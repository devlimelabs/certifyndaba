export type UserClaims = {
  accountType: 'candidate' | 'company' | 'admin';
  aud: string;
  auth_time: number;
  companyID?: string;
  companyGroupID?: string;
  companyUserID?: string;
  email: string;
  email_verified: boolean;
  exp: 1710053993,
  firebase: {
    identities: {
      email?: string[];
      'google.com'?: string[];
      phone?: string[];
      'facebook.com'?: string[];
      apple?: string[];
      [key: string]: any;
    },
    sign_in_provider: string
  };
  iat: number;
  iss: string;
  name: string;
  phone_number: string;
  picture: string;
  role: string;
  sub: string;
  user_id: string;
};
