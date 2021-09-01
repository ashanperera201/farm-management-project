import { StockActions } from '../action-types';

export const setStockDetails = (stockDetails: any) => ({
    type: StockActions.SET_STOCK_DETAILS,
    payload: stockDetails
})

export const addStockDetail = (stockDetail: any) => ({
    type: StockActions.ADD_STOCK,
    payload: stockDetail
})

export const updateStockDetail = (stockDetail: any) => ({
    type: StockActions.UPDATE_STOCK,
    payload: stockDetail
})

export const removeStockBulk = (stockIds: string[]) => ({
    type: StockActions.STOCK_BULK_REMOVE,
    payload: stockIds
})