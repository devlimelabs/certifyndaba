import { Routes } from '@angular/router';

import { profileResolver } from './profile/resolvers/profile.resolver';
import { RequestDetailComponent } from './requests/pages/request-detail/request-detail.component';
import { RequestDetailResolver } from './requests/pages/request-detail/resolve/request-detail.resolver';
import { RequestsListComponent } from './requests/pages/requests-list/requests-list.component';
import { RequestsListResolver } from './requests/pages/requests-list/resolve/requests-list.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BlogFeedComponent } from '../blog-feed/blog-feed.component';
import { ProfileComponent } from './profile/profile.component';
import { profileInputGroupsResolver } from './profile/resolvers/profile-input-groups.resolver';
import { requestCompanyResolver } from './requests/pages/request-detail/resolve/request-company.resolver';
import { RequestsComponent } from '../requests/pages/main/requests.component';


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
        path: '',
        outlet: 'right',
        component: BlogFeedComponent
      }
    ]
  },
  {
    path: ':companyId/:id',
    component: RequestsComponent,
    children: [{
      path: '',
    component: RequestDetailComponent,
      resolve: {
        company: requestCompanyResolver,
        request: RequestDetailResolver
      }
    }]
  }
];
