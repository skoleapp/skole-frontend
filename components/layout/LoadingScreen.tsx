import React from 'react';
import styled from 'styled-components';
import { getLoadingText } from '../../utils';
import { LoadingIndicator } from '../atoms';

const StyledLoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--secondary);
  background: var(--primary);
`;
interface Props {
  loadingText?: string;
}

export const LoadingScreen: React.FC<Props> = ({ loadingText }) => (
  <StyledLoadingScreen>
    <p>{loadingText ? loadingText : getLoadingText()}</p>
    <LoadingIndicator primary />
  </StyledLoadingScreen>
);
