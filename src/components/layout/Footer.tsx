import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useLanguageSelector } from '../../utils';
import { TextLink } from '../shared';

export const Footer: React.FC = () => {
    const { t } = useTranslation();
    const { renderLanguageButton } = useLanguageSelector();

    return (
        <StyledFooter container>
            <Grid item xs={12} container>
                <Grid item xs={4} container direction="column" alignItems="center">
                    <Typography variant="subtitle2" color="secondary" gutterBottom>
                        SKOLE
                    </Typography>
                    <TextLink href="/about" color="secondary">
                        {t('common:about')}
                    </TextLink>
                    <TextLink href="/contact" color="secondary">
                        {t('common:contact')}
                    </TextLink>
                    <TextLink href="/faq" color="secondary">
                        {t('common:faq')}
                    </TextLink>
                </Grid>
                <Grid item xs={4} container direction="column" alignItems="center">
                    <Typography variant="subtitle2" color="secondary" gutterBottom>
                        {t('common:language').toUpperCase()}
                    </Typography>
                    {renderLanguageButton}
                </Grid>
                <Grid item xs={4} container direction="column" alignItems="center">
                    <Typography variant="subtitle2" color="secondary" gutterBottom>
                        {t('common:legal').toUpperCase()}
                    </Typography>
                    <TextLink href="/terms" color="secondary">
                        {t('common:terms')}
                    </TextLink>
                    <TextLink href="/privacy" color="secondary">
                        {t('common:privacy')}
                    </TextLink>
                </Grid>
            </Grid>
            <Grid item xs={12} container justify="center">
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
`;
