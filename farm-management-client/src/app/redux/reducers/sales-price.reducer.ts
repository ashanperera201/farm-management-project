import { SalesPriceActions } from '../action-types';

const initialState = {
  salesPriceDetails: [],
}

export function salesPriceReducer(state = initialState, action: any): any {
  switch (action.type) {
    case SalesPriceActions.SET_SALES_PRICE:
      return {
        ...state,
        salesPriceDetails: action.payload,
      }

    case SalesPriceActions.ADD_SALES_PRICE:
      return {
        ...state,
        salesPriceDetails: [...state.salesPriceDetails, action.payload]
      }
    case SalesPriceActions.UPDATE_SALES_PRICE:
      return {
        ...state,
        salesPriceDetails: state.salesPriceDetails.map((sd: any) => sd._id === action.payload._id ?
          {
            ...sd,
            averageBodyWeight: action.payload.averageBodyWeight,
            salesPrice: action.payload.salesPrice
          } : sd)
      }
    case SalesPriceActions.REMOVE_SALES_PRICE:
      let tempSamples: any[] = [...state.salesPriceDetails];

      if (action.payload && action.payload.length > 0) {
        for (let i = 0; i < action.payload.length; i++) {
          const element = action.payload[i];
          const index: number = tempSamples.findIndex((sd: any) => sd._id === element);
          tempSamples.splice(index, 1)
        }
      }
      return {
        ...state,
        salesPriceDetails: [...tempSamples]
      }
    default:
      return {
        ...state
      }
  }
}