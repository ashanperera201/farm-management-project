import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const harvestSelectFeature = (state: AppState) => state.harvestManagement;

export const selectHarvest = createSelector(
  harvestSelectFeature,
  (state: any) => state.harvestDetails
)