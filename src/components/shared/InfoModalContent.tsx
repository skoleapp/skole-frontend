import { Box, CardContent, Grid, Typography } from '@material-ui/core';
import { UserObjectType } from 'generated/graphql';
import { useMoment } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from './TextLink';

interface InfoItem {
    label: string;
    value?: JSX.Element | JSX.Element[] | string | number | boolean;
}

interface Props {
    user?: UserObjectType | null;
    created?: string;
    infoItems: InfoItem[];
}

export const InfoModalContent: React.FC<Props> = ({ user, created, infoItems }) => {
    const { t } = useTranslation();
    const moment = useMoment();
    const userId = R.propOr(undefined, 'id', user);

    const renderInfoItems = infoItems.map(({ label, value }, i) => (
        <Grid key={i} container>
            <Grid item xs={5}>
                <Typography variant="body2" color="textSecondary">
                    {label}
                </Typography>
            </Grid>
            <Grid item xs={7}>
                <Typography className="truncate" variant="body2">
                    {value || '-'}
                </Typography>
            </Grid>
        </Grid>
    ));

    const renderCreated = !!user && !!created && (
        <Box marginTop="1rem">
            <Typography variant="body2" color="textSecondary">
                {t('common:createdBy')}{' '}
                {!!userId ? (
                    <TextLink href={urls.user} as={`/users/${userId}`} color="primary">
                        {R.propOr('-', 'username', user)}
                    </TextLink>
                ) : (
                    t('common:communityUser')
                )}{' '}
                {moment(created)
                    .startOf('day')
                    .fromNow()}
            </Typography>
        </Box>
    );

    return (
        <CardContent>
            {renderInfoItems}
            {renderCreated}
        </CardContent>
    );
};
