import { UserActions } from '../action-types';

export const setUserInformation = (user: any) => ({
    type: UserActions.SET_USER_INFORMATION,
    payload: user
});

export const updateUserInformation = (user: any) => ({
    type: UserActions.UPDATE_USER_INFROMATION,
    payload: user
});

export const removeUserInformation = () => ({
    type: UserActions.REMOVE_USER_INFORMATION
});

