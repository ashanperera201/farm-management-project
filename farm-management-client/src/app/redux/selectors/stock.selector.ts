import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const stockSelectFeature = (state: AppState) => state.stockManagement;

export const selectStockDetails = createSelector(
    stockSelectFeature,
    (state: any) => state.stockDetails
)