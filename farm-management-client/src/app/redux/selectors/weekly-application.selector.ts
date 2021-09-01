import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const weeklyApplicationSelectFeature = (state: AppState) => state.weeklyApplication;

export const selectWeeklyApplication = createSelector(
  weeklyApplicationSelectFeature,
    (state: any) => state.weeklyApplicationDetails
)