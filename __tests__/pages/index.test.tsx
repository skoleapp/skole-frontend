import Index from '../../pages/index';
import { connectedWrapper } from '../../utils';

describe('landing page', () => {
  const wrapper = connectedWrapper({ component: Index });

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });

  // it('renders main layout', () => {
  //   expect(wrapper.find(<MainLayout />)).toHaveLength(1);
  // });

  // it('renders the landing page', () => {
  //   expect(wrapper.find(<LandingPage />)).toHaveLength(1);
  // });
});
