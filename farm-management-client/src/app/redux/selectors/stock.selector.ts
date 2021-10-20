import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const stockSelectFeature = (state: AppState) => state.stockManagement;
export const cycleSelectFeature = (state: AppState) => state.cycleCount;

export const selectStockDetails = createSelector(
    stockSelectFeature,
    (state: any) => state.stockDetails
)

export const selectCycleCount = createSelector(
  cycleSelectFeature,
  (state: any) => state.cycleCount
)