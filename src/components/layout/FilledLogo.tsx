import React from 'react';
import styled from 'styled-components';

export const FilledLogo: React.FC = () => <StyledLogo src="/images/skole-icon-text-filled.svg" />;

const StyledLogo = styled.img`
    width: 15rem;
    margin-bottom: 1rem;
`;
