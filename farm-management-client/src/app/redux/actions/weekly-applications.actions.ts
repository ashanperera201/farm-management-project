import { WeeklyApplicationsActions } from '../action-types';

export const setWeeklyApplication = (weeklyApplication: any) => ({
    type: WeeklyApplicationsActions.SET_WEEKLY_APPLICATION,
    payload: weeklyApplication
});

export const addWeeklyApplication = (weeklyApplication: any) => ({
    type: WeeklyApplicationsActions.ADD_WEEKLY_APPLICATION,
    payload: weeklyApplication
});

export const updateWeeklyApplication = (weeklyApplication: any) => ({
    type: WeeklyApplicationsActions.UPDATE_WEEKLY_APPLICATION,
    payload: weeklyApplication
});

export const removeWeeklyApplication = (weeklyApplicationIds: any) => ({
    type: WeeklyApplicationsActions.REMOVE_WEEKLY_APPLICATION,
    payload: weeklyApplicationIds
});