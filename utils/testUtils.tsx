import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { initStore } from '../redux';

interface Params {
  component: any; // eslint-disable-line
}

export const connectedWrapper = ({ component: Component }: Params): ShallowWrapper => {
  const store = initStore();

  return shallow(
    <Provider store={store}>
      <Component />
    </Provider>
  ).dive();
};
