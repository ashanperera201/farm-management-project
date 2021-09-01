import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const weeklySamplingSelectFeature = (state: AppState) => state.weeklySampling;

export const selectWeeklySamplings = createSelector(
    weeklySamplingSelectFeature,
    (state: any) => state.weeklySamplingDetails
)