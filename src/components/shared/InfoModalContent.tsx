import { Box, CardContent, Grid, Typography } from '@material-ui/core';
import { UserObjectType } from 'generated/graphql';
import { useMoment } from 'hooks';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TextLink } from '.';

interface InfoItem {
    label: string;
    value?: JSX.Element | string | number | boolean;
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

    const renderCreated = !!user && !!created && (
        <Box marginTop="1rem">
            <Typography variant="body2" color="textSecondary">
                {t('common:createdBy')}{' '}
                {!!userId ? (
                    <TextLink href="/users/[id]" as={`/users/${userId}`} color="primary">
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
            <Grid container>
                <Grid item xs={5}>
                    {infoItems.map(({ label }, i) => (
                        <Typography key={i} variant="body2" color="textSecondary">
                            {label}
                        </Typography>
                    ))}
                </Grid>
                <Grid item xs={7}>
                    {infoItems.map(({ value }, i) => (
                        <Typography key={i} className="truncate" variant="body2">
                            {value || '-'}
                        </Typography>
                    ))}
                </Grid>
            </Grid>
            {renderCreated}
        </CardContent>
    );
};
