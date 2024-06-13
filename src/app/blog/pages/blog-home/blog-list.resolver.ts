import type { ResolveFn } from '@angular/router';
import { ButterService } from '../../services/butter.service';

export const blogListResolver: ResolveFn<any[]> = async (route, state) => {

  return ((await ButterService.post.list({
    page: 1,
    page_size: 15
  }))?.data ?? []) as any[];
};
