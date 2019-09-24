import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

interface Params {
  component: any; // eslint-disable-line
}

export default ({ component: Component }: Params): ShallowWrapper => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore();

  return shallow(<Component store={store} />)
    .dive()
    .dive();
};
