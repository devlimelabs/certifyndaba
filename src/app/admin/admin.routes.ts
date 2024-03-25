import { Routes } from '@angular/router';

import { candidateVerificationsResolver } from './pages/verifications/resolve/candidate-verifications.resolver';
import { AuthGuard } from '@angular/fire/auth-guard';
import { isAdmin } from '~auth/guards/firebase-guards';

export const AdminRoutes: Routes = [
  {
    path: 'verifications',
    canActivate: [ AuthGuard ],
    data: { authGuardPipe: isAdmin },
    loadComponent: () => import('./pages/verifications/verifications.component').then(x => x.VerificationsComponent),
    resolve: {
      unverifiedCandidates: candidateVerificationsResolver
    }
  }
];
