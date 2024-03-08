import { Routes } from '@angular/router';
import {
  canActivate, redirectLoggedInTo, redirectUnauthorizedTo, AuthGuard, customClaims
} from '@angular/fire/auth-guard';
import { AppRedirectComponent } from './core/app-redirect/app-redirect.component';
import { map, pipe } from 'rxjs';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([ 'login' ]);
const redirectLoggedInToApp = () => redirectLoggedInTo([ '/app' ]);
const adminOnly = () => pipe(customClaims, map((claims: any) => claims?.role === 'admin'));

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
        path: 'sign-in',
        loadComponent: () => import('./auth/pages/login/login.component').then(c => c.LoginComponent),
        ...canActivate(redirectLoggedInToApp)

      }
    ]
  },
  {
    path: 'app',
    ...canActivate(redirectUnauthorizedToLogin),
    loadComponent: () => import('./layout/pages/app-layout/app-layout.component').then(c => c.AppLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AppRedirectComponent
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then((x) => x.AdminRoutes),
        canActivate: [ AuthGuard ],
        data: { authGuardPipe: adminOnly }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
