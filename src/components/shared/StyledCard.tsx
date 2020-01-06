import { Card } from '@material-ui/core';
import styled from 'styled-components';

export const StyledCard = styled(Card)`
    flex-grow: 1;

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
