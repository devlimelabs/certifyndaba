import { Routes } from '@angular/router';

import { candidateVerificationsResolver } from './pages/verifications/resolve/candidate-verifications.resolver';

export const AdminRoutes: Routes = [
  {
    path: 'verifications',
    loadComponent: () => import('./pages/verifications/verifications.component').then(x => x.VerificationsComponent),
    resolve: {
      unverifiedCandidates: candidateVerificationsResolver
    }
  }
];
