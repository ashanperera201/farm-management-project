import { WeeklyApplicationsActions } from '../action-types';


const initialState = {
  weeklyApplicationDetails: [],
}

export function weeklyApplicationReducer(state = initialState, action: any): any {
  switch (action.type) {
    case WeeklyApplicationsActions.SET_WEEKLY_APPLICATION:
      return {
        ...state,
        weeklyApplicationDetails: action.payload,
      }

    case WeeklyApplicationsActions.ADD_WEEKLY_APPLICATION:
      return {
        ...state,
        weeklyApplicationDetails: [...state.weeklyApplicationDetails, action.payload]
      }
    case WeeklyApplicationsActions.UPDATE_WEEKLY_APPLICATION:
      return {
        ...state,
        weeklyApplicationDetails: state.weeklyApplicationDetails.map((sd: any) => sd._id === action.payload._id ?
          {
            ...sd,
            farmer: action.payload.farmer,
            owner: action.payload.owner,
            pond: action.payload.pond,
            application: action.payload.application,
            weekNumber: action.payload.weekNumber,
            unit: action.payload.unit,
            numberOfUnit: action.payload.numberOfUnit,
          } : sd)
      }
    case WeeklyApplicationsActions.REMOVE_WEEKLY_APPLICATION:
      let tempSamples: any[] = [...state.weeklyApplicationDetails];

      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          const element = action.payload[i];
          const index: number = tempSamples.findIndex((sd: any) => sd._id === element);
          tempSamples.splice(index, 1)
        }
      }
      return {
        ...state,
        weeklyApplicationDetails: [...tempSamples]
      }
    default:
      return {
        ...state
      }
  }
}