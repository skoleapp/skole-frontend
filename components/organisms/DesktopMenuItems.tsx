import React from 'react';
import styled from 'styled-components';
import { MenuList } from '../molecules';

const StyledDesktopMenuItems = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const DesktopMenuItems: React.FC = () => (
  <StyledDesktopMenuItems>
    <MenuList />
  </StyledDesktopMenuItems>
);
