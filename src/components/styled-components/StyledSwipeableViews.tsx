import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';

export const StyledSwipeableViews = styled(props => <SwipeableViews {...props} resistance />)`
    display: flex;
    flex-grow: 1;

    > div {
        display: flex;
        flex-grow: 1;

        > div {
            display: flex;
        }
    }
`;
