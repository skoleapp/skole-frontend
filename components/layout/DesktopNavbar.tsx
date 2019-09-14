import React from 'react';
import { Row } from '../containers';
import { DesktopMenuList } from '../molecules';
import styled from 'styled-components';

const StyledDesktopNavbar = styled.div`
  justify-content: start;
  display: flex;
  align-items: center;
  height: 100%;
`;

export const DesktopNavbar: React.FC = () => (
  <StyledDesktopNavbar>
    <Row>
      <DesktopMenuList />
    </Row>
  </StyledDesktopNavbar>
);
