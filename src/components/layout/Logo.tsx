import { Link } from '../../i18n';
import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export const Logo: React.FC = () => (
    <Link href="/">
        <StyledLogo variant="h1">skole</StyledLogo>
    </Link>
);

const StyledLogo = styled(Typography)`
    font-family: 'Roboto Mono', monospace !important;
    color: var(--secondary);
    cursor: pointer;
`;
