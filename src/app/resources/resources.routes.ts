import { Routes } from '@angular/router';
import { RelocationToolsComponent } from './pages/relocation-tools/relocation-tools.component';
import { CareersComponent } from './pages/careers/careers.component';
import { careerPageResolver } from './pages/careers/career-page.resolver';
import { BlogHomeComponent } from '../blog/pages/blog-home/blog-home.component';
import { blogListResolver } from '../blog/pages/blog-home/blog-list.resolver';

export const ResourcesRoutes: Routes = [
  {
    path: 'aba-careers',
    component: CareersComponent,
    resolve: {
      careerPage: careerPageResolver
    }
  },
  {
    path: 'blog',
    component: BlogHomeComponent,
    resolve: {
      blogList: blogListResolver
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
