import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const userSelectFeature = (state: AppState) => state.loggedInData;

export const selectUserDetails = createSelector(
    userSelectFeature,
    (state: any) => state.user
)