import { Box, CardContent, Grid, Typography } from '@material-ui/core';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { UserObjectType } from 'generated';
import { urls } from 'utils';

import { TextLink } from './TextLink';

interface InfoItem {
  label: string;
  value?: JSX.Element | JSX.Element[] | string | number | boolean;
}

interface Props {
  creator?: UserObjectType | null;
  created?: string;
  infoItems: InfoItem[];
}

export const InfoDialogContent: React.FC<Props> = ({ user, created, infoItems }) => {
  const { t } = useTranslation();
  const userId = R.prop('id', user);

  const renderInfoItems = infoItems.map(({ label, value }, i) => (
    <Grid key={i} container>
      <Grid item xs={5}>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography className="truncate-text" variant="body2">
          {value}
        </Typography>
      </Grid>
    </Grid>
  ));

  const renderCreated = !!created && (
    <Box marginTop="1rem">
      <Typography variant="body2" color="textSecondary">
        {t('common:createdBy')}{' '}
        {user ? (
          <TextLink href={urls.user(userId)} color="primary">
            {user.username}
          </TextLink>
        ) : (
          t('common:communityUser')
        )}{' '}
        {useDayjs(created).startOf('day').fromNow()}
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
