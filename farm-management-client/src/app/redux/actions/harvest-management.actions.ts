import { HarvestActions } from '../action-types';

export const setHarvest = (harvest: any) => ({
  type: HarvestActions.SET_HARVEST,
  payload: harvest
});

export const addHarvest = (harvest: any) => ({
  type: HarvestActions.ADD_HARVEST,
  payload: harvest
});

export const updateHarvest = (harvest: any) => ({
  type: HarvestActions.UPDATE_HARVEST,
  payload: harvest
});

export const removeHarvest = (harvestIds: any) => ({
  type: HarvestActions.REMOVE_HARVEST,
  payload: harvestIds
});