import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { State, Store } from '@ngrx/store';

import * as moment from 'moment';
import { fromEvent, of, Subscription } from 'rxjs';
import { exhaustMap, map, switchMap, takeWhile, tap } from 'rxjs/operators';
import { custCreateCard, initCardStripe, initiatePayCard, paymentCreateCard, paymentFailureCard, sourceCreateCard } from 'src/app/actions/card.actions';
import { PaymentService } from 'src/app/service/payment.service';

export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date): string {
    var formatString = 'MM YYYY';
    return moment(date).format(formatString);
  }
}

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: CustomDateAdapter
    }
  ]
})

export class PaymentCardComponent implements OnInit, OnDestroy, AfterViewInit {

  form: FormGroup;
  minData: Date;

  @ViewChild('saveButton', { static: true }) save: ElementRef;

  cusId: string;

  private cardCallsSubs: Subscription;
  buttonSubscription$: Subscription;

  constructor(
    private _FB: FormBuilder,
    private store: Store<any>,
    private paymentService: PaymentService,
  ) { }

  ngOnInit(): void {

    this.store.dispatch(initCardStripe());

    this.minData = new Date();

    this.form = this._FB.group({
      creditCardNumber: ['', Validators.required],
      cardHolder: ['', Validators.required],
      expirationDate: [new Date(), Validators.required],
      securityCode: ['', Validators.minLength(3)],
      amount: [50, [Validators.required]]
    })

  }

  ngAfterViewInit() {

    this.cardCallsSubs = fromEvent(this.save.nativeElement, 'click')
      .pipe(
        tap((_) => console.log(this.form.valid)),
        takeWhile((_) => this.form.valid),
        exhaustMap((_) => of(this.store.dispatch(initiatePayCard({ data: this.form.value }))))
      )
      .subscribe((_) => {

      });
  }

  ngOnDestroy() {
    this.cardCallsSubs.unsubscribe();
  }

}
