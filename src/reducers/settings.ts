import { AnyAction } from 'redux';
import { TOGGLE_SETTINGS } from '../actions';

export interface Settings {
    open: boolean;
}

const initialState: Settings = {
    open: false,
};

export const settingsReducer = (state = initialState, action: AnyAction): Settings => {
    switch (action.type) {
        case TOGGLE_SETTINGS: {
            return { open: action.payload };
        }

        default: {
            return state;
        }
    }
};
