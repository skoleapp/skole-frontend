import { shallow } from 'enzyme';
import React from 'react';
import { LandingPage, MainLayout } from '../../components';
import Index from '../../pages/index';

describe('landing page', () => {
  let wrapper = shallow(<Index />);
  const layout = wrapper.find(<MainLayout />);
  const landingPage = layout.find(<LandingPage />);

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('renders main layout', () => {
    expect(layout).toHaveLength(1);
  });

  it('renders the landing page', () => {
    expect(landingPage).toHaveLength(1);
  });
});
