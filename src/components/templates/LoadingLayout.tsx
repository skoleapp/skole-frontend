import { Paper } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';
import { MainLayoutProps } from 'types';

import { LoadingBox } from '../shared';
import { MainLayout } from './MainLayout';

export const LoadingLayout: React.FC<Pick<MainLayoutProps, 'seoProps'>> = ({ seoProps }) => {
    const layoutProps = {
        seoProps,
        disableBottomNavbar: true,
        disableFooter: true,
        topNavbarProps: {
            disableAuthButtons: true,
            disableLogo: true,
            disableSearch: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledLoadingLayout>
                <LoadingBox />
            </StyledLoadingLayout>
        </MainLayout>
    );
};

const StyledLoadingLayout = styled(Paper)`
    position: absolute;
    top: 3rem;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;

    @media only screen and (min-width: ${breakpoints.MD}) {
        top: 4rem;
    }
`;
