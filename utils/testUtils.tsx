import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from '../redux';

const store = createStore(rootReducer, applyMiddleware(thunk));

interface Params {
  component: any; // eslint-disable-line
}

export const connectedWrapper = ({ component: Component }: Params): ShallowWrapper =>
  shallow(
    <Provider store={store}>
      <Component />
    </Provider>
  ).dive();
