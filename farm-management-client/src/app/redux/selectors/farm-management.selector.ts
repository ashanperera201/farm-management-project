import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const farmManagementSelectFeature = (state: AppState) => state.farmManagement;

export const selectFarmManagement = createSelector(
  farmManagementSelectFeature,
  (state: any) => state.farmManagementDetails
)