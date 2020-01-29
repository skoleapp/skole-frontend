import { Card, CardContent, Typography } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { Link } from '../../i18n';

interface Props {
    text: string;
    icon: SvgIconComponent;
    href: string;
}

export const Shortcut: React.FC<Props> = ({ text, icon: Icon, href }) => (
    <Link href={href}>
        <StyledShortcut>
            <CardContent>
                <Icon color="primary" />
                <Typography variant="h2">{text}</Typography>
            </CardContent>
        </StyledShortcut>
    </Link>
);

const StyledShortcut = styled(Card)`
    margin: 0.5rem;
    cursor: pointer;
    width: 14rem;
    height: 14rem;

    .MuiCardContent-root {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .MuiSvgIcon-root {
            height: 5rem;
            width: 5rem;
            margin: 0.5rem;
        }
    }

    &:hover {
        background-color: var(--hover-opacity);
    }
`;
