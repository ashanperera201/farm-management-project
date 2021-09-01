import { UserActions } from '../action-types';

const initialState = {
    user: null,
}

export function UserReducer(state = initialState, action: any): any {
    switch (action.type) {
        case UserActions.SET_USER_INFORMATION:
            return {
                ...state,
                user: action.payload,
            }
        // case UserActions.UPDATE_USER_INFROMATION:
        //     return {
        //         ...state,
        //         user: action.payload,
        //     }
        case UserActions.REMOVE_USER_INFORMATION:
            return {
                ...state,
                user: null
            }
        default:
            return {
                ...state
            }
    }
}