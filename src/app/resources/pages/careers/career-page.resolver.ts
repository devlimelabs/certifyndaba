import type { ResolveFn } from '@angular/router';
import { ButterService } from 'src/app/blog/services/butter.service';

export const careerPageResolver: ResolveFn<any> = async (route, state) => {
  return (await ButterService.page.retrieve('*', 'careers-in-aba')).data;
};
