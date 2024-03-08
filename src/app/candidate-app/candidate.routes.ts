import { Routes } from '@angular/router';

import { RequestsComponent } from '../requests/pages/main/requests.component';
import { profileResolver } from './profile/resolve/profile.resolver';
import { RequestDetailComponent } from './requests/pages/request-detail/request-detail.component';
import { RequestDetailResolver } from './requests/pages/request-detail/resolve/request-detail.resolver';
import { RequestsListComponent } from './requests/pages/requests-list/requests-list.component';
import { RequestsListResolver } from './requests/pages/requests-list/resolve/requests-list.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BlogFeedComponent } from '../blog-feed/blog-feed.component';


export const CandidateRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'requests',
        component: RequestsComponent,
        children: [
          {
            path: '',
            component: RequestsListComponent,
            resolve: {
              requests: RequestsListResolver
            }
          },
          {
            path: ':id',
            component: RequestDetailComponent,
            resolve: {
              request: RequestDetailResolver
            }
          }
        ]
      },
      {
        path: '',
        outlet: 'right',
        component: BlogFeedComponent
      }
    ]
  },
  {
    path: 'profile',
    resolve: {
      profile: profileResolver
    },
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  }
];
