import { DailyFeedActions } from '../action-types';


const initialState = {
  dailyFeedDetails: [],
}

export function dailyFeedReducer(state = initialState, action: any): any {
  switch (action.type) {
    case DailyFeedActions.SET_DAILY_FEED:
      return {
        ...state,
        dailyFeedDetails: action.payload,
      }

    case DailyFeedActions.ADD_DAILY_FEED:
      return {
        ...state,
        dailyFeedDetails: [...state.dailyFeedDetails, action.payload]
      }
    case DailyFeedActions.UPDATE_DAILY_FEED:
      return {
        ...state,
        dailyFeedDetails: state.dailyFeedDetails.map((sd: any) => sd._id === action.payload._id ?
          {
            ...sd,
            owner: action.payload.owner,
            farmer: action.payload.farmer,
            pond: action.payload.pond,
            dailyFeedDate: action.payload.dailyFeedDate,
            actualNumberOfKilos: action.payload.actualNumberOfKilos,
            remark: action.payload.remark
          } : sd)
      }
    case DailyFeedActions.REMOVE_DAILY_FEED:
      let tempSamples: any[] = [...state.dailyFeedDetails];

      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          const element = action.payload[i];
          const index: number = tempSamples.findIndex((sd: any) => sd._id === element);
          tempSamples.splice(index, 1)
        }
      }
      return {
        ...state,
        dailyFeedDetails: [...tempSamples]
      }
    default:
      return {
        ...state
      }
  }
}