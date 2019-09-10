import React from 'react';
import { GoButton, LogoHeader, SearchInput } from '../atoms';
import { Row } from '../containers';

export const LandingPage: React.FC = () => (
  <>
    <LogoHeader />
    <Row>
      <SearchInput type="text" placeholder="Search courses..." />
      <GoButton />
    </Row>
  </>
);
