import { css } from '@emotion/core';
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: black;
`;

interface Props {
  primary?: boolean;
}

export const LoadingIndicator: React.FC<Props> = ({ primary }) => {
  return (
    <ClipLoader
      css={override}
      sizeUnit={'rem'}
      size={2}
      color={primary ? 'var(--secondary)' : 'var(--primary)'}
    />
  );
};
