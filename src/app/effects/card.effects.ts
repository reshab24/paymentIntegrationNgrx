import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { authCard, custCreateCard, initCardStripe, initiatePayCard, paymentCreateCard, paymentFailureCard, paymentSuccessCard, sourceCreateCard } from '../actions/card.actions';
import { State } from '../reducers';
import { PaymentService } from '../service/payment.service';
import { ToastServiceService } from '../service/toast-service.service';



@Injectable()
export class CardEffects {
  constructor(private actions$: Actions, private paymentService: PaymentService, private store: Store<State>, private tost: ToastServiceService) { }
  loadStripe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initCardStripe),
      /** An EMPTY observable only emits completion. Replace with your own observable stream */
      tap(async () => {
        try {
          await this.paymentService.loadStripe();
        } catch (error) {
          console.log(error);
        }
      }));
  }, {dispatch: false});

  createToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initiatePayCard),
      map((action) => action.data),
      switchMap(async (data) => {
        try {
          const result = await this.paymentService.createToken(data);
          return authCard({ data: result })
        } catch (error) {
          return paymentFailureCard({ error, message: 'Error while authenticating card details' })
        }
      }),
    );
  });

  authenticated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authCard),
      /** An EMPTY observable only emits completion. Replace with your own observable stream */
      switchMap(_ => {
        console.log('AuthCard');
        return of(
          custCreateCard({
            data:
            {
              'description': "test",
              "email": "reshab24vai@gmail.com",
              "name": "reshab"
            }
          }
          )
        )
      })
    )
  })

  createCustomer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(custCreateCard),
      map(action => action.data),
      switchMap(async (data) => {
        try {
          const result = await this.paymentService.createCustomer(data);
          console.log(result);
          return sourceCreateCard({ data: { customerId: result.cus.id } })
        } catch (error) {
          return paymentFailureCard({ error, message: 'Error while creating customer' })
        }
      })
    );
  });

  createSource$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(sourceCreateCard),
      map(action => action.data),
      withLatestFrom(this.store.select('card')),
      switchMap(async ([data, card]) => {
        try {
          await this.paymentService.createSource({ sourceToken: card.sourceToken, customerId: data.customerId })
          return paymentCreateCard({ data: { customerId: data.customerId } })
        } catch (error) {
          return paymentFailureCard({ error, message: 'Error while creating source' })
        }
      })
    );
  });

  createPayment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(paymentCreateCard),
      map(action => action.data),
      withLatestFrom(this.store.select('card')),
      switchMap(async ([{ customerId }, { cardDetails }]) => {
        try {
          await this.paymentService.createPayment({ amount: cardDetails.amount, cardId: cardDetails.cardId, customerId })
          return paymentSuccessCard({ message: 'Payment excuted successfully' })
        } catch (error) {
          return paymentFailureCard({ error, message: 'Payment failed' })
        }
      })
    );
  });

  paymentSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(paymentSuccessCard),
      /** An EMPTY observable only emits completion. Replace with your own observable stream */
      tap(({ message }) => this.tost.openSnackBar(message, 'ok')));
  }, {dispatch: false});

  paymentFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(paymentFailureCard),
      /** An EMPTY observable only emits completion. Replace with your own observable stream */
      tap(({ message, error }) => { console.log(error); this.tost.openSnackBar(message, 'ok') }));
  }, {dispatch: false});
}
