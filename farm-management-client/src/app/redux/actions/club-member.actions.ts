import { ClubMemberActions } from '../action-types';


export const setClubMember = (clubMember: any) => ({
  type: ClubMemberActions.SET_CLUB_MEMBER,
  payload: clubMember
});

export const addClubMember = (clubMember: any) => ({
  type: ClubMemberActions.ADD_CLUB_MEMBER,
  payload: clubMember
});

export const updateClubMember = (clubMember: any) => ({
  type: ClubMemberActions.UPDATE_CLUB_MEMBER,
  payload: clubMember
});

export const removeClubMember = (clubMemberIds: any) => ({
  type: ClubMemberActions.REMOVE_CLUB_MEMBER,
  payload: clubMemberIds
});