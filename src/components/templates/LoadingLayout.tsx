import { Box, CardContent } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { LoadingBox, StyledCard } from '../shared';
import { MainLayout } from './MainLayout';

export const LoadingLayout: React.FC = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('common:loading'),
        },
    };

    return (
        <StyledLoadingLayout>
            <MainLayout {...layoutProps}>
                <StyledCard>
                    <CardContent>
                        <LoadingBox />
                    </CardContent>
                </StyledCard>
            </MainLayout>
        </StyledLoadingLayout>
    );
};

const StyledLoadingLayout = styled(Box)`
    .MuiCardContent-root {
        flex-grow: 1;
        display: flex;
    }
`;
