import { ApplicationActions } from '../action-types';


const initialState = {
  applicationDetails: [],
}

export function applicationReducer(state = initialState, action: any): any {
  switch (action.type) {
    case ApplicationActions.SET_APPLICATION:
      return {
        ...state,
        applicationDetails: action.payload,
      }

    case ApplicationActions.ADD_APPLICATION:
      return {
        ...state,
        applicationDetails: [...state.applicationDetails, action.payload]
      }
    case ApplicationActions.UPDATE_APPLICATION:
      return {
        ...state,
        applicationDetails: state.applicationDetails.map((sd: any) => sd._id === action.payload._id ?
          {
            ...sd,
            applicationType: action.payload.applicationType,
            applicantName: action.payload.applicantName,
            unit: action.payload.unit,
            costPerUnit: action.payload.costPerUnit
          } : sd)
      }
    case ApplicationActions.REMOVE_APPLICATION:
      let tempSamples: any[] = [...state.applicationDetails];

      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          const element = action.payload[i];
          const index: number = tempSamples.findIndex((sd: any) => sd._id === element);
          tempSamples.splice(index, 1)
        }
      }
      return {
        ...state,
        applicationDetails: [...tempSamples]
      }
    default:
      return {
        ...state
      }
  }
}