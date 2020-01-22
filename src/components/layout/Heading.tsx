import { Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

interface Props {
    text: string;
}

export const Heading: React.FC<Props> = ({ text }) => <StyledHeading variant="h2">{text}</StyledHeading>;

const StyledHeading = styled(Typography)`
    max-width: 10rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
