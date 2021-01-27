import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { cardReducer, CardState } from './card.reducer';


export interface State {
  card: CardState
}

export const reducers: ActionReducerMap<State> = {
  card: cardReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
