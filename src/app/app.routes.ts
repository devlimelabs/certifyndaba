import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/pages/site-layout/site-layout.component').then(c => c.SiteLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./about/about.component').then(c => c.AboutComponent)
      },
      {
        path: '404',
        loadComponent: () => import('./layout/pages/not-found/not-found.component').then(x => x.NotFoundComponent)
      },
      {
        path: 'company/sign-up',
        loadComponent: () => import('./company-signup/company-signup.component').then(c => c.CompanySignupComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component').then(c => c.ContactComponent)
      },
      {
        path: 'employers',
        loadComponent: () => import('./landing-pages/pages/company-landing/company-landing.component').then(c => c.CompanyLandingComponent)
      },
      {
        path: 'faqs',
        loadComponent: () => import('./faqs/faqs.component').then(c => c.FaqsComponent)
      },
      {
        path: 'individuals',
        loadComponent: () => import('./landing-pages/pages/candidate-landing/candidate-landing.component').then(c => c.CandidateLandingComponent)
      },
      {
        path: 'legal',
        loadChildren: () => import('./legal/legal.routes').then((x) => x.LegalRoutes)
      },
      {
        path: 'resources',
        loadChildren: () => import('./resources/resources.routes').then((x) => x.ResourcesRoutes)
      }
    ]
  },
];
