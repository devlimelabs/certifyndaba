import type { ResolveFn } from '@angular/router';
import { ButterService } from '../../services/butter.service';

export const blogFeedResolver: ResolveFn<any[]> = async (route, state) => {
  const { category } = route.params;

  return ((await ButterService.post.list({
    category_slug: category,
    page: 1,
    page_size: 10
  }))?.data ?? []) as any[];
};
