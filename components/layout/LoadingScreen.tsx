import React from 'react';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

export const LoadingScreen: React.FC = () => (
  <div>
    <ClipLoader css={override} sizeUnit={'px'} size={35} color={'var(--primary)'} />
  </div>
);
