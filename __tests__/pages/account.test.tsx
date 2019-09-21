import React from 'react';
import { AccountPage, MainLayout } from '../../components';
import Account from '../../pages/account';
import { initialAuthState } from '../../redux';
import { connectedWrapper } from '../../utils';

describe('account page', () => {
  const wrapper = connectedWrapper({ component: Account });
  const layout = wrapper.find(<MainLayout />);
  const accountPage = layout.find(<AccountPage {...initialAuthState.user} />);

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('renders main layout', () => {
    expect(layout).toHaveLength(1);
  });

  it('renders the account page', () => {
    expect(accountPage).toHaveLength(1);
  });
});
