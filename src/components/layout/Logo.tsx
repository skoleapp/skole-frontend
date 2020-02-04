import React from 'react';
import styled from 'styled-components';

import { Link } from '../../i18n';

export const Logo: React.FC = () => (
    <Link href="/">
        <StyledLogo src="/images/skole-icon-text.svg" />
    </Link>
);

const StyledLogo = styled.img`
    cursor: pointer;
    height: 1.25rem;
`;
