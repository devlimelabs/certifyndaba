import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import {
  NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent
} from '@angular/router';
import {
  BehaviorSubject, filter, map, ReplaySubject, Subject
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  private loading = new BehaviorSubject<boolean>(true);
  private navigationEnd = new Subject<void>();
  private navLinks = new ReplaySubject<any[]>(1);
  private pageTitle = new BehaviorSubject<string>('');
  private _scrollToTop = new Subject<void>();
  private showRightPanel = new BehaviorSubject(true);

  isMobile$ = this.breakpointObserver
    .observe([ '(max-width: 767px )' ])
    .pipe(map(result => result.matches));

  loading$ = this.loading.asObservable();
  navigationEnd$ = this.navigationEnd.asObservable();
  navLinks$ = this.navLinks.asObservable();
  pageTitle$ = this.pageTitle.asObservable();
  scrollToTop$ = this._scrollToTop.asObservable();
  showRightPanel$ = this.showRightPanel.asObservable();

  constructor() {
    this.router.events
      .pipe(
        filter((ev: any) => ev instanceof NavigationStart || this.isNavigationEnd(ev))
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loading.next(true);
        } else if (this.isNavigationEnd(event)) {
          this.loading.next(false);
          this.navigationEnd.next();
        }
      });
  }

  scrollToTop(): void {
    this._scrollToTop.next();
  }

  setPageTitle(title: string): void {
    this.pageTitle.next(title);
  }

  setRightPanel(show: boolean) {
    this.showRightPanel.next(show);
  }

  private isNavigationEnd(ev: RouterEvent): boolean {
    return ev instanceof NavigationEnd || ev instanceof NavigationError;
  }
}
