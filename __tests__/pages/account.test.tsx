import Account from '../../pages/account';
import { connectedWrapper } from '../../utils';

describe('account page', () => {
  const wrapper = connectedWrapper({ component: Account });

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });

  // it('renders main layout', () => {
  //   expect(wrapper.find(<MainLayout />)).toHaveLength(1);
  // });

  // it('renders the account page', () => {
  //   expect(wrapper.find(<AccountPage {...initialAuthState.user} />)).toHaveLength(1);
  // });
});
