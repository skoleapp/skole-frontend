import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';

export const StyledSwipeableViews = styled(SwipeableViews)`
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
