import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { APIService, UserPushSettings } from 'graphql-api';
import { lastValueFrom } from 'rxjs';
import {
  filter, switchMap, take 
} from 'rxjs/operators';
import { AppAuthState } from 'src/app/auth/state/auth.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  private api = inject(APIService);
  private appAuthState = inject(AppAuthState);
  private swPush = inject(SwPush);

  private userPushSettings: UserPushSettings | null = null;

  async init(): Promise<void> {
    this.userPushSettings = (await lastValueFrom(this.appAuthState.isLoggedIn$
      .pipe(
        filter(isLoggedIn => !!isLoggedIn),
        switchMap(() => this.api.GetUserPushSettings(this.appAuthState.get('authUser')?.sub)),
        take(1)
      )));

    if (this.userPushSettings) {
      await this.updatePushSubscription();
    } else {
      await this.createPushSubscription();
    }
  }

  async createPushSubscription(): Promise<void> {
    try {
      const pushSubscription = await this.swPush.requestSubscription({ serverPublicKey: environment.pushPublicKey });
      console.log('pushSubscription', pushSubscription);
      this.userPushSettings = await this.api.CreateUserPushSettings({
        userID: this.appAuthState.get('authUser').sub,
        requests: true,
        messages: true,
        updates: true,
        subscription: JSON.stringify(pushSubscription)
      });
    } catch (err) {
      console.error('err', err);
    }
  }

  async updatePushSubscription(): Promise<void> {
    try {
      const pushSubscription = await this.swPush.requestSubscription({ serverPublicKey: environment.pushPublicKey });
      console.log('pushSubscription', pushSubscription);
      this.userPushSettings = await this.api.UpdateUserPushSettings({
        userID: this.appAuthState.get('authUser').sub,
        subscription: JSON.stringify(pushSubscription)
      });
    } catch (err) {
      console.error('err', err);
    }
  }
}
