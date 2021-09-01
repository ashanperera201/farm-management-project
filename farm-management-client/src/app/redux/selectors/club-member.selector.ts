import { createSelector } from '@ngrx/store';
import { AppState } from '../application-state';

export const clubMemberSelectFeature = (state: AppState) => state.clubMember;

export const selectClubMember = createSelector(
  clubMemberSelectFeature,
  (state: any) => state.clubMemberDetails
)