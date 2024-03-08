import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { APIService, UserPushSettings } from 'graphql-api';
import { AppAuthState } from 'src/app/auth/state/auth.state';

export const userPushSettingsResolver: ResolveFn<UserPushSettings> = (route, state) => {
  return inject(APIService).GetUserPushSettings(inject(AppAuthState).get('authUser')?.sub);
};
