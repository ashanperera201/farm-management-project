import { StockActions } from '../action-types';

const initialState = {
    stockDetails: [],
}

export function stockReducer(state = initialState, action: any): any {
    switch (action.type) {
        case StockActions.SET_STOCK_DETAILS:
            return {
                ...state,
                stockDetails: action.payload,
            }

        case StockActions.ADD_STOCK:
            return {
                ...state,
                stockDetails: [...state.stockDetails, action.payload]
            }

        case StockActions.UPDATE_STOCK:
            return {
                ...state,
                stockDetails: state.stockDetails.map((sd: any) => sd._id === action.payload._id ?
                    {
                        ...sd,
                        owner: action.payload.owner,
                        farmer: action.payload.farmer,
                        pond: action.payload.pond,
                        plCount: action.payload.plCount,
                        plAge: action.payload.plAge,
                        dateOfStocking: action.payload.dateOfStocking,
                        fullStocked: action.payload.fullStocked,
                        plPrice: action.payload.plPrice,
                        actualPlRemains: action.payload.actualPlRemains,
                    } : sd)
            }
        case StockActions.STOCK_BULK_REMOVE:
            action.payload.forEach((id: any) => {
                const index: number = state.stockDetails.findIndex((sd: any) => sd._id === id);
                state.stockDetails.splice(index, 1)
            });
            return {
                ...state,
                stockDetails: [...state.stockDetails]
            }
        default:
            return {
                ...state
            }
    }
}