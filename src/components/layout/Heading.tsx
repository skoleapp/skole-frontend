import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';

interface Props {
    text: string;
}

export const Heading: React.FC<Props> = ({ text }) => <StyledHeading variant="h6">{text}</StyledHeading>;

const StyledHeading = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
