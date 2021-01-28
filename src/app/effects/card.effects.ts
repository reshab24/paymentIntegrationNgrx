import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { authCard, custCreateCard, initCardStripe, initiatePayCard, paymentCreateCard, paymentFailureCard, paymentSuccessCard, sourceCreateCard } from '../actions/card.actions';
import { State } from '../reducers';
import { PaymentService } from '../service/payment.service';
import { ToastServiceService } from '../service/toast-service.service';

@Injectable()
export class CardEffects {
  data: any;
  constructor(private actions$: Actions, private paymentService: PaymentService, private store: Store<State>, private tost: ToastServiceService) { }
  loadStripe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initCardStripe),
      switchMap((_) => this.paymentService.loadStripe().pipe(
        catchError((error) => of(paymentFailureCard({ error, message: 'Payment failed' }))
        )))
    )
  }, { dispatch: false });

  createToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initiatePayCard),
      map((action) => action.data),
      tap((res) => console.log(res, "responce")),
      switchMap((data) => { return this.paymentService.createToken(data) }),
      switchMap((result) => {
        return of(authCard({ data: result })).pipe(
          catchError((error) => of(paymentFailureCard({ error, message: 'Payment failed' }))
          ))
      })
    )
  });

  authenticated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authCard),
      switchMap((_) => {
        return of(custCreateCard({ data: { 'description': "test", "email": "reshab24vai@gmail.com", "name": "reshab" } })).pipe(
          catchError((error) => of(paymentFailureCard({ error, message: 'Payment failed' }))
          ))
      })
    );
  });

  createCustomer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(custCreateCard),
      map(action => action.data),
      switchMap((data) => { return this.paymentService.createCustomer(data) }),
      switchMap((result) => {
        return of(sourceCreateCard({ data: { customerId: result.cus.id } })).pipe(
          catchError((error) => of(paymentFailureCard({ error, message: 'Payment failed' }))
          ))
      })
    );
  });

  createSource$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(sourceCreateCard),
      map(action => action.data),
      withLatestFrom(this.store.select('card')),
      tap((data) => { this.data = data; console.log(this.data, "datap") }),
      switchMap(([data, card]) => this.paymentService.createSource({ sourceToken: card.sourceToken, customerId: data.customerId })),
      switchMap((_) => {
        return of(paymentCreateCard({ data: { customerId: this.data[0].customerId } })).pipe(
          catchError((error) => of(paymentFailureCard({ error, message: 'Payment failed' }))
          ))
      }),
    );
  });

  createPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(paymentCreateCard),
      map(action => action.data),
      withLatestFrom(this.store.select('card')),
      switchMap(([{ customerId }, { cardDetails }]) => this.paymentService.createPayment({ amount: cardDetails.amount, cardId: cardDetails.cardId, customerId }).pipe(
        switchMap((_) => of(paymentSuccessCard({ message: 'Payment excuted successfully' }))),
        catchError((error) => of(paymentFailureCard({ error, message: 'Payment failed' }))
        ))),
    );
  });

  paymentSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(paymentSuccessCard),
      tap(({ message }) => this.tost.openSnackBar(message, 'ok')));
  }, { dispatch: false });

  paymentFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(paymentFailureCard),
      tap(({ message, error }) => { console.log(error); this.tost.openSnackBar(message, 'ok') }));
  }, { dispatch: false });
}
