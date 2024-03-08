import type { ResolveFn } from '@angular/router';
import { ButterService } from '../../services/butter.service';

export const blogPostResolver: ResolveFn<any> = async (route, state) => {
  const { slug } = route.params;

  const post = (await ButterService.post.retrieve(slug))?.data;
  /* TODO: get previous and next posts from res.meta */

  return post;
};
