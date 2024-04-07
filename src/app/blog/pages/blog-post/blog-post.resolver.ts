import { Router, type ResolveFn } from '@angular/router';
import { ButterService } from '../../services/butter.service';
import map from 'lodash/map';
import { inject } from '@angular/core';
import { AuthStore } from '~auth/state/auth.store';
import { LocalStorage } from 'src/app/core/local-storage';
import { patchState } from '@ngrx/signals';

export const blogPostResolver: ResolveFn<any> = async (route, state) => {
  const { slug } = route.params;

  const authStore = inject(AuthStore);
  const localStorageSvc = inject(LocalStorage);
  const router = inject(Router);

  const post: any = (await ButterService.post.retrieve(slug))?.data;

  /* TODO: get previous and next posts from res.meta */
  const tagNames = map(post?.tags, 'name');

  if (tagNames?.includes('members-only')) {
    if (authStore.isLoggedIn()) {
      return post;
    }

    localStorageSvc?.setItem('redirect', state.url);
    patchState(authStore, { loginMessage: 'Please sign in to view this content' });

    return router.navigateByUrl(`/sign-in`);
  }

  return post;
};
