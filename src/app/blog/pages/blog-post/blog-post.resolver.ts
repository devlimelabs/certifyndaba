import type { ResolveFn } from '@angular/router';
import { ButterService } from '../../services/butter.service';

export const blogPostResolver: ResolveFn<any> = async (route, state) => {
  const { category } = route.data;
  const { slug } = route.params;

  return (await ButterService.post.retrieve(slug))?.data?.data;

};
