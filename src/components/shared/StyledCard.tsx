import { Card } from '@material-ui/core';
import { breakpoints } from '../../styles';
import styled from 'styled-components';

export const StyledCard = styled(Card)`
    margin: 0 auto;
    width: 100%;

    @media only screen and (max-width: ${breakpoints.SM}) {
        flex-grow: 1;
    }

    @media only screen and (min-width: ${breakpoints.SM}) {
        max-width: 35rem;
    }

    .MuiCardHeader-title {
        text-align: center;
    }

    .MuiButton-root {
        margin-top: 0.5rem;
    }

    .main-avatar {
        height: 10rem;
        width: 10rem;
        margin: 1rem;
    }

    .label {
        font-size: 0.75rem;
    }
`;
