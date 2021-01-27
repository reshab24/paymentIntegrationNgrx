import { Action, createReducer, on } from '@ngrx/store';
import { authCard, initCardStripe, initiatePayCard } from '../actions/card.actions';
import { creditCardDto } from '../dto/creditCardDto';


export interface CardState {
  cardDetails: creditCardDto,
  sourceToken: string
}

export const initialState: CardState = {
  cardDetails: null,
  sourceToken: null,
};


export const cardReducer = createReducer(
  initialState,
  on(initCardStripe, (state)=>{
    return {
      ...state
    }
  }),
  on(initiatePayCard, (state, {data})=>{
    return {
      ...state,
      cardDetails: data
    }
  }),
  on(authCard, (state, action)=>{
    return {
      ...state,
      sourceToken: action.data.id,
      cardDetails: {
        ...state.cardDetails,
        cardId: action.data.card.id
      }
    }
  })
);

