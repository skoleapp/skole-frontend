import React from 'react';
import styled from 'styled-components';
import { Icon } from '../atoms/Icon';

const StyledHomeButton = styled.div``;

// TODO: Implement a proper search widget
export const SearchWidget: React.FC = () => (
  <StyledHomeButton onClick={(): void => alert('I am useless!')}>
    <Icon iconName="search" variant="white" iconSize="2" />
  </StyledHomeButton>
);
