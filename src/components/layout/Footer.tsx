import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { breakpoints } from '../../styles';
import { useLanguageSelector } from '../../utils';
import { TextLink } from '../shared';

export const Footer: React.FC = () => {
    const { t } = useTranslation();
    const { renderLanguageButton } = useLanguageSelector();

    return (
        <StyledFooter className="md-up" container>
            <Grid item xs={12} container>
                <Grid item xs={4} container>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="secondary" gutterBottom>
                            SKOLE
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextLink href="/about" color="secondary">
                            {t('common:about')}
                        </TextLink>
                    </Grid>
                    <Grid item xs={12}>
                        <TextLink href="/contact" color="secondary">
                            {t('common:contact')}
                        </TextLink>
                    </Grid>
                </Grid>
                <Grid item xs={4} container>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="secondary" gutterBottom>
                            {t('common:language').toUpperCase()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {renderLanguageButton}
                    </Grid>
                </Grid>
                <Grid item xs={4} container>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="secondary" gutterBottom>
                            {t('common:legal').toUpperCase()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextLink href="/terms" color="secondary">
                            {t('common:terms')}
                        </TextLink>
                    </Grid>
                    <Grid item xs={12}>
                        <TextLink href="/privacy" color="secondary">
                            {t('common:privacy')}
                        </TextLink>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle1" color="secondary">
                    © {new Date().getFullYear()} {t('common:skoleTeam')}
                </Typography>
            </Grid>
        </StyledFooter>
    );
};

const StyledFooter = styled(Grid)`
    position: absolute;
    bottom: -10rem;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--primary);
    padding: 0.5rem;

    @media only screen and (max-width: ${breakpoints.MD}) {
        display: none !important;
    }
`;
