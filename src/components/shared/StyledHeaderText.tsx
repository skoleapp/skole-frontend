import { Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

interface Props {
    text?: string;
}

export const StyledHeaderText: React.FC<Props> = ({ text }) => (
    <StyledStyledHeaderText variant="h2">{text}</StyledStyledHeaderText>
);

const StyledStyledHeaderText = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
