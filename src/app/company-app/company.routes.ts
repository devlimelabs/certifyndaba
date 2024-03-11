import { Routes } from '@angular/router';

import { RequestsComponent } from '../requests/pages/main/requests.component';
import {
  CompanyRequestsDisplayListComponent
} from './requests/components/company-requests-display-list/company-requests-display-list.component';
import { CompanyRequestDetailComponent } from './requests/pages/company-request-detail/company-request-detail.component';
import {
  CompanyRequestDetailResolver
} from './requests/pages/company-request-detail/resolve/company-request-detail.resolver';
import { CompanyRequestsListComponent } from './requests/pages/company-requests-list/company-requests-list.component';
import { CompanyRequestsListResolver } from './requests/pages/company-requests-list/resolve/company-requests-list.resolver';
import { companyInfoResolver } from './candidate-search/resolve/company-info.resolver';
import { CompanyProfileComponent } from './company-profile/company-profile/company-profile.component';
import { CandidateSearchComponent } from './candidate-search/candidate-search.component';
import { candidateSearchResolver } from './candidate-search/resolve/candidate-search.resolver';


export const CompanyRoutes: Routes = [
  {
    path: 'profile',
    component: CompanyProfileComponent,
    resolve: {
      company: companyInfoResolver
    }
  },
  {
    path: 'requests',
    component: RequestsComponent,
    children: [
      {
        path: '',
        component: CompanyRequestsListComponent,
        children: [
          {
            path: ':status',
            component: CompanyRequestsDisplayListComponent,
            resolve: {
              requests: CompanyRequestsListResolver
            },
            runGuardsAndResolvers: 'always'
          }
        ]
      },
      {
        path: ':status/:id',
        component: CompanyRequestDetailComponent,
        resolve: {
          request: CompanyRequestDetailResolver
        }
      }
    ]
  },
  {
    path: 'search',
    component: CandidateSearchComponent,
    resolve: {
      candidates: candidateSearchResolver,
      company: companyInfoResolver
    }
  }
];
