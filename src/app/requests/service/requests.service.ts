import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private backToListLink = new BehaviorSubject('../');
  readonly backToListLink$ = this.backToListLink.asObservable();

  private showBackToList = new BehaviorSubject(false);
  readonly showBacktoList$ = this.showBackToList.asObservable();

  private showRequestButton = new BehaviorSubject(false);
  readonly showRequestButton$ = this.showRequestButton.asObservable();

  setShowBackToList(showBackToList: boolean): void {
    this.showBackToList.next(showBackToList);
  }

  setBackToListLink(backToListLink: string): void {
    this.backToListLink.next(backToListLink);
  }

  setShowRequestButton(showRequestButton: boolean): void {
    this.showRequestButton.next(showRequestButton);
  }

}
