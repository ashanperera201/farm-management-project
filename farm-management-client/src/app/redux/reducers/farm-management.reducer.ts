import { FarmActions } from '../action-types';


const initialState = {
  farmManagementDetails: [],
}

export function farmManagmentReducer(state = initialState, action: any): any {
  switch (action.type) {
    case FarmActions.SET_FARM:
      return {
        ...state,
        farmManagementDetails: action.payload,
      }

    case FarmActions.ADD_FARM:
      return {
        ...state,
        farmManagementDetails: [...state.farmManagementDetails, action.payload]
      }
    case FarmActions.UPDATE_FARM:
      return {
        ...state,
        farmManagementDetails: state.farmManagementDetails.map((sd: any) => sd._id === action.payload._id ?
          {
            ...sd,
            owner: action.payload.owner,
            farmName: action.payload.farmName,
            contactNo: action.payload.contactNo,
            address: action.payload.address,
            pondCount: action.payload.pondCount
          } : sd)
      }
    case FarmActions.REMOVE_FARM:
      let tempSamples: any[] = [...state.farmManagementDetails];

      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          const element = action.payload[i];
          const index: number = tempSamples.findIndex((sd: any) => sd._id === element);
          tempSamples.splice(index, 1)
        }
      }
      return {
        ...state,
        farmManagementDetails: [...tempSamples]
      }
    default:
      return {
        ...state
      }
  }
}