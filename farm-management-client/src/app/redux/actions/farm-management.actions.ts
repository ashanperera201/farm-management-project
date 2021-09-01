import { FarmActions } from '../action-types';

export const setFarmManagement = (farm: any) => ({
  type: FarmActions.SET_FARM,
  payload: farm
});

export const addFarmManagement = (farm: any) => ({
  type: FarmActions.ADD_FARM,
  payload: farm
});

export const updateFarmManagement = (farm: any) => ({
  type: FarmActions.UPDATE_FARM,
  payload: farm
});

export const removeFarmManagement = (farmIds: any) => ({
  type: FarmActions.REMOVE_FARM,
  payload: farmIds
});