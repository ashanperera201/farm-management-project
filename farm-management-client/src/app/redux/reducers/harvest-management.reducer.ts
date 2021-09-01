import { HarvestActions } from '../action-types';

const initialState = {
  harvestDetails: [],
}

export function harvestReducer(state = initialState, action: any): any {
  switch (action.type) {
    case HarvestActions.SET_HARVEST:
      return {
        ...state,
        harvestDetails: action.payload,
      }

    case HarvestActions.ADD_HARVEST:
      return {
        ...state,
        harvestDetails: [...state.harvestDetails, action.payload]
      }
    case HarvestActions.UPDATE_HARVEST:
      return {
        ...state,
        harvestDetails: state.harvestDetails.map((sd: any) => sd._id === action.payload._id ?
          {
            ...sd,
            owner: action.payload.owner,
            farmer: action.payload.farmer,
            pond: action.payload.pond,
            harvestDate: action.payload.harvestDate,
            harvestAWB: action.payload.harvestAWB,
            harvestType: action.payload.harvestType,
            harvestQuantity: action.payload.harvestQuantity,
            harvestSalePrice: action.payload.harvestSalePrice
          } : sd)
      }
    case HarvestActions.REMOVE_HARVEST:
      let tempSamples: any[] = [...state.harvestDetails];

      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          const element = action.payload[i];
          const index: number = tempSamples.findIndex((sd: any) => sd._id === element);
          tempSamples.splice(index, 1)
        }
      }
      return {
        ...state,
        harvestDetails: [...tempSamples]
      }
    default:
      return {
        ...state
      }
  }
}