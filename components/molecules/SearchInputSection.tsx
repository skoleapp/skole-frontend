import React from 'react';
import { GoButton, SearchInput } from '../atoms';
import { Row } from '../containers';

export const SearchInputSection: React.FC = () => (
  <Row>
    <SearchInput type="text" placeholder="Search courses..." />
    <GoButton />
  </Row>
);
