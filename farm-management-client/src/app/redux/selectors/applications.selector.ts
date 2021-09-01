import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const applicationSelectFeature = (state: AppState) => state.application;

export const selectApplication = createSelector(
  applicationSelectFeature,
  (state: any) => state.applicationDetails
)