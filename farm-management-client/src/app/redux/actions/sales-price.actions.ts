import { SalesPriceActions } from '../action-types';

export const setSalesPrice = (salesPrice: any) => ({
    type: SalesPriceActions.SET_SALES_PRICE,
    payload: salesPrice
});

export const addSalesPrice = (salesPrice: any) => ({
    type: SalesPriceActions.ADD_SALES_PRICE,
    payload: salesPrice
});

export const updateSalesPrice = (salesPrice: any) => ({
    type: SalesPriceActions.UPDATE_SALES_PRICE,
    payload: salesPrice
});

export const removeSalesPrice = (salesPriceIds: any) => ({
    type: SalesPriceActions.REMOVE_SALES_PRICE,
    payload: salesPriceIds
});