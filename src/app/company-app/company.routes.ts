import { Routes } from '@angular/router';

import { RequestsComponent } from '../requests/pages/main/requests.component';
import { CompanyRequestDetailComponent } from './requests/pages/company-request-detail/company-request-detail.component';
import {
  CompanyRequestDetailResolver
} from './requests/pages/company-request-detail/resolve/company-request-detail.resolver';
import { CompanyRequestsListResolver } from './requests/pages/company-requests-list/resolve/company-requests-list.resolver';
import { companyInfoResolver } from './candidate-search/resolve/company-info.resolver';
import { CompanyProfileComponent } from './company-profile/company-profile/company-profile.component';
import { CandidateSearchComponent } from './candidate-search/candidate-search.component';
import { candidateSearchResolver } from './candidate-search/resolve/candidate-search.resolver';
import { SearchService } from '../search/services/search.service';
import { SearchState } from '../search/state/search.state';
import { CompanyRequestsListComponent } from './requests/pages/company-requests-list/company-requests-list.component';
import { companyProfileInputGroupsResolver } from './company-profile/company-profile/resolvers/company-profile-input-groups.resolver';
import { requestCandidateResolver } from './requests/pages/company-request-detail/resolve/request-candidate.resolver';


export const CompanyRoutes: Routes = [
  {
    path: 'profile',
    component: CompanyProfileComponent,
    resolve: {
      company: companyInfoResolver,
      inputGroups: companyProfileInputGroupsResolver
    }
  },
  {
    path: 'requests',
    component: RequestsComponent,
    resolve: {
      requests: CompanyRequestsListResolver
    },
    children: [
      {
        path: '',
        component: CompanyRequestsListComponent,
        resolve: {
          requests: CompanyRequestsListResolver
        }
      },
      {
        path: ':id',
        component: CompanyRequestDetailComponent,
        resolve: {
          candidate: requestCandidateResolver,
          request: CompanyRequestDetailResolver
        }
      }
    ]
  },
  {
    path: 'search',
    component: CandidateSearchComponent,
    providers: [ SearchService, SearchState ],
    resolve: {
      candidates: candidateSearchResolver,
      company: companyInfoResolver
    }
  }
];
