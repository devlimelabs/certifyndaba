import { Routes } from '@angular/router';

import { profileResolver } from './profile/resolve/profile.resolver';
import { RequestDetailComponent } from './requests/pages/request-detail/request-detail.component';
import { RequestDetailResolver } from './requests/pages/request-detail/resolve/request-detail.resolver';
import { RequestsListComponent } from './requests/pages/requests-list/requests-list.component';
import { RequestsListResolver } from './requests/pages/requests-list/resolve/requests-list.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BlogFeedComponent } from '../blog-feed/blog-feed.component';
import { ProfileComponent } from './profile/profile.component';
import { profileInputGroupsResolver } from './profile/resolve/profile-input-groups.resolver';


export const CandidateRoutes: Routes = [
  {
    path: 'profile',
    resolve: {
      profile: profileResolver,
      inputGroups: profileInputGroupsResolver
    },
    component: ProfileComponent
  },
  {
    path: '',
    component: DashboardComponent,
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
      },
      {
        path: '',
        outlet: 'right',
        component: BlogFeedComponent
      }
    ]
  }
];
