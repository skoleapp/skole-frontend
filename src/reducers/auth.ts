import { AnyAction } from 'redux';

import { UserType } from '../../generated/graphql';
import { AUTHENTICATE, DE_AUTHENTICATE, RE_AUTHENTICATE } from '../actions';

export interface Auth {
    user: UserType | null;
    authenticated: boolean | null;
}

const initialState: Auth = {
    user: null,
    authenticated: null,
};

export const authReducer = (state = initialState, action: AnyAction): Auth => {
    switch (action.type) {
        case AUTHENTICATE:
        case RE_AUTHENTICATE: {
            return {
                authenticated: true,
                user: { ...action.payload },
            };
        }

        case DE_AUTHENTICATE: {
            return initialState;
        }

        default:
            return state;
    }
};
