import React from 'react';
import { GoButton, Header, SearchInput } from '../atoms';
import { IntersectingWrapper, Row } from '../molecules';

export const LandingPage: React.FC = () => (
  <IntersectingWrapper time={4}>
    <Header />
    <Row className="input-section">
      <SearchInput type="text" placeholder="Search courses..." />
      <GoButton />
    </Row>
  </IntersectingWrapper>
);
