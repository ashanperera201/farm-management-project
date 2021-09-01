import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const salesPriceSelectFeature = (state: AppState) => state.salesPrice;

export const selectsalesPrice = createSelector(
  salesPriceSelectFeature,
  (state: any) => state.salesPriceDetails
)