import { Tabs } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

export const StyledTabs = styled(props => (
    <Tabs textColor="primary" variant="fullWidth" indicatorColor="primary" {...props} />
))`
    border-bottom: var(--border);
`;
