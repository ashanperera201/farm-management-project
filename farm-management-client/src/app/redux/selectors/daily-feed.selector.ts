import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const dailyFeedSelectFeature = (state: AppState) => state.dailyFeed;

export const selectDailyFeed = createSelector(
  dailyFeedSelectFeature,
  (state: any) => state.dailyFeedDetails
)