import { css } from '@emotion/core';
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import styled from 'styled-components';
import { getLoadingText } from '../../utils';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

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
    <ClipLoader css={override} sizeUnit={'rem'} size={2} color={'var(--secondary)'} />
  </StyledLoadingScreen>
);
