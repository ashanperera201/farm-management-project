import { WeeklySamplingActions } from '../action-types';

const initialState = {
    weeklySamplingDetails: [],
}

export function weeklySamplingReducer(state = initialState, action: any): any {
    switch (action.type) {
        case WeeklySamplingActions.SET_WEEKLY_SAMPLING:
            return {
                ...state,
                weeklySamplingDetails: action.payload,
            }

        case WeeklySamplingActions.ADD_WEEKLY_SAMPLING:
            return {
                ...state,
                weeklySamplingDetails: [...state.weeklySamplingDetails, action.payload]
            }
        case WeeklySamplingActions.UPDATE_WEEKLY_SAMPLING:
            return {
                ...state,
                weeklySamplingDetails: state.weeklySamplingDetails.map((sd: any) => sd._id === action.payload._id ?
                    {
                        ...sd,
                        samplingDate: action.payload.samplingDate,
                        farmer: action.payload.farmer,
                        owner: action.payload.owner,
                        pond: action.payload.pond,
                        dateOfCulture: action.payload.dateOfCulture,
                        totalWeight: action.payload.totalWeight,
                        totalShrimp: action.payload.totalShrimp,
                        averageBodyWeight: action.payload.averageBodyWeight,
                        previousAwb: action.payload.previousAwb,
                        gainInWeight: action.payload.gainInWeight,
                        expectedSurvivalPercentage: action.payload.expectedSurvivalPercentage,
                    } : sd)
            }
        case WeeklySamplingActions.REMOVE_WEEKLY_SAMPLING:
            let tempSamples: any[] = [...state.weeklySamplingDetails];

            if (action.payload && action.payload.length > 0) {
                for (let i = 0; i < action.payload.length; i++) {
                    const element = action.payload[i];
                    const index: number = tempSamples.findIndex((sd: any) => sd._id === element);
                    tempSamples.splice(index, 1)
                }
            } 
            return {
                ...state,
                weeklySamplingDetails: [...tempSamples]
            }
        default:
            return {
                ...state
            }
    }
}