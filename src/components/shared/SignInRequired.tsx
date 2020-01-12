import { CardContent, CardHeader, Grid } from '@material-ui/core';

import { ButtonLink } from './ButtonLink';
import { Layout } from './Layout';
import React from 'react';
import { StyledCard } from './StyledCard';
import { useTranslation } from 'react-i18next';

export const SignInRequired: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Layout title={t('sign-in-required:title')} backUrl>
            <StyledCard>
                <Grid container justify="center">
                    <Grid item xs={12} sm={8} md={6} lg={4}>
                        <CardHeader title={t('sign-in-required:text')} />
                        <CardContent>
                            <ButtonLink
                                variant="outlined"
                                color="primary"
                                href={{ pathname: '/sign-in', query: { next: '/upload-resource' } }}
                                fullWidth
                            >
                                {t('sign-in-required:button')}
                            </ButtonLink>
                        </CardContent>
                    </Grid>
                </Grid>
            </StyledCard>
        </Layout>
    );
};
