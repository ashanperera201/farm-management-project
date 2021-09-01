import { WeeklySamplingActions } from '../action-types';

export const setWeeklySamplings = (weeklySamplings: any) => ({
    type: WeeklySamplingActions.SET_WEEKLY_SAMPLING,
    payload: weeklySamplings
});

export const addWeeklySamplings = (weeklySampling: any) => ({
    type: WeeklySamplingActions.ADD_WEEKLY_SAMPLING,
    payload: weeklySampling
});

export const updateWeeklySamplings = (weeklySampling: any) => ({
    type: WeeklySamplingActions.UPDATE_WEEKLY_SAMPLING,
    payload: weeklySampling
});

export const removeWeeklySamplings = (weeklySamplingIds: any) => ({
    type: WeeklySamplingActions.REMOVE_WEEKLY_SAMPLING,
    payload: weeklySamplingIds
});