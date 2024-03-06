import { Routes } from '@angular/router';

export const LegalRoutes: Routes = [
  {
    path: 'privacy-policy',
    loadComponent: () => import('./privacy-policy/privacy-policy.component').then((c) => c.PrivacyPolicyComponent)
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./terms-of-service/terms-of-service.component').then((c) => c.TermsOfServiceComponent)
  }
];
