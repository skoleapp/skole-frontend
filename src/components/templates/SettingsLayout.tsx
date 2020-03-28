import { CardContent, CardHeader, Grid, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { LayoutProps } from '../../types';
import { useSettings } from '../../utils';
import { SettingsButton, StyledCard } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    formLayout?: boolean;
    infoLayout?: boolean;
    infoContent?: string;
    fullSize?: boolean;
}

export const SettingsLayout: React.FC<Props> = ({
    title,
    heading,
    renderCardContent,
    formLayout,
    infoLayout,
    infoContent,
    fullSize,
    ...props
}) => {
    const { renderSettingsCardContent } = useSettings({ modal: false });

    const customColSpan = {
        sm: 8,
        md: 6,
        lg: 5,
    };

    const layoutProps = formLayout || infoLayout ? customColSpan : {};
    const renderInfoContent = infoContent && <Typography variant="body2">{infoContent}</Typography>;
    const renderHeaderRight = <SettingsButton color="secondary" />;

    return (
        <StyledSettingsLayout
            title={title}
            heading={heading}
            headerRight={renderHeaderRight}
            fullSize={fullSize}
            {...props}
        >
            <Grid container>
                <Grid className="md-up" item xs={12} md={4} lg={3}>
                    <StyledCard>
                        <CardContent>{renderSettingsCardContent}</CardContent>
                    </StyledCard>
                </Grid>
                <Grid item xs={12} md={8} lg={9} container>
                    <StyledCard marginLeft>
                        <CardHeader className="md-up border-bottom" title={heading} />
                        <Grid container justify="center">
                            <Grid item container direction="column" xs={12} {...layoutProps}>
                                <CardContent className="container">
                                    {renderCardContent}
                                    {renderInfoContent}
                                </CardContent>
                            </Grid>
                        </Grid>
                    </StyledCard>
                </Grid>
            </Grid>
        </StyledSettingsLayout>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledSettingsLayout = styled(({ fullSize, ...other }) => <MainLayout {...other} />)`
    .MuiGrid-root,
    .container {
        flex-grow: 1;
        display: flex;
        padding: ${({ fullSize }): string => (fullSize ? '0 !important' : 'initial')};

        form {
            width: 100%;
        }
    }
`;
