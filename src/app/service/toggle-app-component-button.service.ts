import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleAppComponentButtonService {

  private toggleState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor() { }

  toggleState(state:boolean):void{
    this.toggleState$.next(state);
  }

  get getToggleState() :Observable<boolean>{
    return this.toggleState$.asObservable();
  }


}
