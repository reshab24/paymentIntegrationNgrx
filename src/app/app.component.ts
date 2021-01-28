import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { ToggleAppComponentButtonService } from './service/toggle-app-component-button.service';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from './reducers';
import { creditCardDto } from './dto/creditCardDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'paymentTest';

  toggleState$: Observable<boolean>;
  cardStoreData$: Observable<creditCardDto>;
  private routePipesSubs: Subscription;

  constructor(
    private toggleService: ToggleAppComponentButtonService,
    private router: Router,
    private store: Store<State>
  ) { }

  ngOnInit(): void {

    this.toggleState$ = this.toggleService.getToggleState;

    this.routePipesSubs = this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((res: NavigationEnd) => {
        (res.url === '/home') ? (this.toggleService.toggleState(false)) : (this.toggleService.toggleState(true));
      })

    this.cardStoreData$ = this.store.select('card').pipe(
      map(data => data.cardDetails)
    );

  }

  ngOnDestroy() {
    this.routePipesSubs.unsubscribe();
  }



}

