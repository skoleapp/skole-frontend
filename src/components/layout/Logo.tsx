import { Link } from '../../i18n';
import React from 'react';
import styled from 'styled-components';

export const Logo: React.FC = () => (
    <Link href="/">
        <StyledLogo src="/images/logo-text.svg" />
    </Link>
);

const StyledLogo = styled.img`
    cursor: pointer;
    height: 1.5rem;
`;
