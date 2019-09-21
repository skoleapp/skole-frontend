import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import React from 'react';
import Account from '../pages/account';
import Course from '../pages/course';
import CreateCourse from '../pages/create-course';
import EditAccount from '../pages/edit-account';
import Feedback from '../pages/feedback';
import Index from '../pages/index';
import Login from '../pages/login';
import Register from '../pages/register';
import Search from '../pages/search';
import UploadResource from '../pages/upload-resource';

Enzyme.configure({ adapter: new EnzymeAdapter() });

describe('Pages', () => {
  describe('Index', () => {
    it('renders without crashing', () => {
      shallow(<Index />);
    });
  });

  describe('Account', () => {
    it('renders without crashing', () => {
      shallow(<Account />);
    });
  });

  describe('EditAccount', () => {
    it('renders without crashing', () => {
      shallow(<EditAccount />);
    });
  });

  describe('Course', () => {
    it('renders without crashing', () => {
      shallow(<Course />);
    });
  });

  describe('CreateCourse', () => {
    it('renders without crashing', () => {
      shallow(<CreateCourse />);
    });
  });

  describe('Feedback', () => {
    it('renders without crashing', () => {
      shallow(<Feedback />);
    });
  });

  describe('Login', () => {
    it('renders without crashing', () => {
      shallow(<Login />);
    });
  });

  describe('Register', () => {
    it('renders without crashing', () => {
      shallow(<Register />);
    });
  });

  describe('Search', () => {
    it('renders without crashing', () => {
      shallow(<Search />);
    });
  });

  describe('UploadResource', () => {
    it('renders without crashing', () => {
      shallow(<UploadResource />);
    });
  });
});
