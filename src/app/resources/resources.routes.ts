import { Routes } from '@angular/router';
import { RelocationToolsComponent } from './pages/relocation-tools/relocation-tools.component';
import { CareersComponent } from './pages/careers/careers.component';
import { careerPageResolver } from './pages/careers/career-page.resolver';

export const ResourcesRoutes: Routes = [
  {
    path: 'aba-careers',
    component: CareersComponent,
    resolve: {
      careerPage: careerPageResolver
    }
  },
  {
    path: 'relocation-tools',
    component: RelocationToolsComponent
  },
  {
    path: ':category',
    loadChildren: () => import('../blog/blog.routes').then(r => r.BlogRoutes)
  }
];
