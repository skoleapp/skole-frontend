import { Grid, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { useLanguageSelector } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';

const useStyles = makeStyles(({ palette, spacing }) => ({
    root: {
        backgroundColor: palette.primary.main,
        padding: spacing(4),
    },
    copyRightSection: {
        marginTop: spacing(2),
    },
    someLink: {
        color: palette.secondary.main,
        textDecoration: 'none',
        // width: '3rem',
        // height: '3rem',
    },
    someLinkContainer: {
        marginTop: spacing(4),
    },
}));

export const Footer: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { renderLanguageButton } = useLanguageSelector();

    const renderAboutSection = (
        <Grid item xs={4} container justify="center">
            <Grid item xs={2} container direction="column">
                <Typography variant="subtitle1" color="secondary" gutterBottom>
                    SKOLE
                </Typography>
                <TextLink href={urls.about} color="secondary">
                    {t('common:about')}
                </TextLink>
                <TextLink href={urls.contact} color="secondary">
                    {t('common:contact')}
                </TextLink>
                <TextLink href={urls.faq} color="secondary">
                    {t('common:faq')}
                </TextLink>
                <Grid className={classes.someLinkContainer} item container justify="space-between">
                    <a
                        href="https://www.facebook.com/skoleofficial"
                        className={clsx(classes.someLink, 'fa fa-facebook fa-lg')}
                        target="_blank"
                        rel="noreferrer"
                    />
                    <a
                        href="https://www.instagram.com/skoleofficial/"
                        className={clsx(classes.someLink, 'fa fa-instagram fa-lg')}
                        target="_blank"
                        rel="noreferrer"
                    />
                    <a
                        href="https://twitter.com/skoleofficial"
                        className={clsx(classes.someLink, 'fa fa-twitter fa-lg')}
                        target="_blank"
                        rel="noreferrer"
                    />
                    <a
                        href="https://www.linkedin.com/company/skole-inc"
                        className={clsx(classes.someLink, 'fa fa-linkedin fa-lg')}
                        target="_blank"
                        rel="noreferrer"
                    />
                </Grid>
            </Grid>
        </Grid>
    );

    const renderLanguageHeader = (
        <Typography variant="subtitle1" color="secondary" gutterBottom>
            {t('common:language').toUpperCase()}
        </Typography>
    );

    const renderLanguageSection = (
        <Grid item xs={4} container direction="column" alignItems="center">
            {renderLanguageHeader}
            {renderLanguageButton}
        </Grid>
    );

    const renderLegalSection = (
        <Grid item xs={4} container justify="center">
            <Grid item xs={2} container direction="column">
                <Typography variant="subtitle1" color="secondary" gutterBottom>
                    {t('common:legal').toUpperCase()}
                </Typography>
                <TextLink href={urls.terms} color="secondary">
                    {t('common:terms')}
                </TextLink>
                <TextLink href={urls.privacy} color="secondary">
                    {t('common:privacy')}
                </TextLink>
            </Grid>
        </Grid>
    );

    const renderCopyRight = (
        <Typography variant="subtitle1" color="secondary">
            © {new Date().getFullYear()} Skole
        </Typography>
    );

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} container>
                {renderAboutSection}
                {renderLanguageSection}
                {renderLegalSection}
            </Grid>
            <Grid item xs={12} container className={classes.copyRightSection} justify="center">
                {renderCopyRight}
            </Grid>
        </Grid>
    );
};
