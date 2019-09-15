import { css } from '@emotion/core';
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import styled from 'styled-components';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

const StyledLoadingScreen = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--secondary);
  background: var(--primary);
`;
interface Props {
  text: string;
}

export const LoadingScreen: React.FC<Props> = ({ text }) => (
  <StyledLoadingScreen>
    <p>{text}</p>
    <ClipLoader css={override} sizeUnit={'rem'} size={2} color={'var(--secondary)'} />
  </StyledLoadingScreen>
);
