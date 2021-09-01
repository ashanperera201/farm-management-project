import { ApplicationActions } from '../action-types';

export const setApplication = (application: any) => ({
  type: ApplicationActions.SET_APPLICATION,
  payload: application
});

export const addApplication = (application: any) => ({
  type: ApplicationActions.ADD_APPLICATION,
  payload: application
});

export const updateApplication = (application: any) => ({
  type: ApplicationActions.UPDATE_APPLICATION,
  payload: application
});

export const removeApplication = (applicationIds: any) => ({
  type: ApplicationActions.REMOVE_APPLICATION,
  payload: applicationIds
});