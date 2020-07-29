import { Link } from 'lib';
import React from 'react';
import styled from 'styled-components';
import { urls } from 'utils';

export const Logo: React.FC = () => (
    <Link href={urls.home}>
        <StyledLogo src="/images/skole-icon-text.svg" />
    </Link>
);

const StyledLogo = styled.img`
    cursor: pointer;
    height: 1.25rem;
`;
