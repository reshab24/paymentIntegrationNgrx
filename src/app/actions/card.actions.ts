import { createAction, props } from '@ngrx/store';
import { creditCardDto } from '../dto/creditCardDto';

export const initCardStripe = createAction(
  '[Card] Init Stripe'
);

export const initiatePayCard = createAction(
  '[Card] Initiate Pay',
  props<{ data: creditCardDto }>()
);

export const authCard = createAction(
  '[Card] Authenticate',
  props<{ data: { card: { id: string }, id: string } }>()
);

export const custCreateCard = createAction(
  '[Card] Create Customer',
  props<{ data: { 'description': string, "email": string, "name": string } }>()
);

export const sourceCreateCard = createAction(
  '[Card] Create Source',
  props<{ data: { customerId: string } }>()
);

export const paymentCreateCard = createAction(
  '[Card] Create Payment',
  props<{ data: { customerId: string } }>()
);

export const paymentFailureCard = createAction(
  '[Card] Payment Failure',
  props<{ error: any, message: string }>()
);

export const paymentSuccessCard = createAction(
  '[Card] Payment Success',
  props<{ message: string }>()
);
