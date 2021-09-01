import { ClubMemberActions } from '../action-types';


const initialState = {
  clubMemberDetails: [],
}

export function clubMemberReducer(state = initialState, action: any): any {
  switch (action.type) {
    case ClubMemberActions.SET_CLUB_MEMBER:
      return {
        ...state,
        clubMemberDetails: action.payload,
      }

    case ClubMemberActions.ADD_CLUB_MEMBER:
      return {
        ...state,
        clubMemberDetails: [...state.clubMemberDetails, action.payload]
      }
    case ClubMemberActions.UPDATE_CLUB_MEMBER:
      return {
        ...state,
        clubMemberDetails: state.clubMemberDetails.map((sd: any) => sd._id === action.payload._id ?
          {
            ...sd,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            email: action.payload.email,
            contactNumber: action.payload.contactNumber,
            nic: action.payload.nic,
            city: action.payload.city,
            address: action.payload.address,
            userName: action.payload.userName,
            password: action.payload.password
          } : sd)
      }
    case ClubMemberActions.REMOVE_CLUB_MEMBER:
      let tempSamples: any[] = [...state.clubMemberDetails];

      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          const element = action.payload[i];
          const index: number = tempSamples.findIndex((sd: any) => sd._id === element);
          tempSamples.splice(index, 1)
        }
      }
      return {
        ...state,
        clubMemberDetails: [...tempSamples]
      }
    default:
      return {
        ...state
      }
  }
}