import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PickIntervalService {
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();


  constructor() { }
  changeMessage(startInterval: any) {
    this.messageSource.next(startInterval)
  }
}
