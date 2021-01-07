import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { UserObjectType } from 'generated';
import { useDayjs } from 'hooks';
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
  creator?: UserObjectType | null;
  created?: string;
  infoItems: InfoItem[];
}

export const InfoDialogContent: React.FC<Props> = ({ creator, created, infoItems }) => {
  const { t } = useTranslation();
  const userId = R.prop('id', creator);
  const communityUser = t('common:communityUser');
  const createdBy = t('common:createdBy');

  const renderInfoItems = infoItems.map(({ label, value }, i) => (
    <Grid key={i} container>
      <Grid item xs={6}>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography className="truncate-text" variant="body2">
          {value}
        </Typography>
      </Grid>
    </Grid>
  ));

  const renderCreatorLink = !!creator && (
    <TextLink href={urls.user(userId)} color="primary">
      {creator.username}
    </TextLink>
  );

  const renderCreator = creator ? renderCreatorLink : communityUser;
  const renderCreationTime = useDayjs(created).startOf('day').fromNow();

  const renderCreated = !!created && (
    <Box marginTop="1rem">
      <Typography variant="body2" color="textSecondary">
        {createdBy} {renderCreator} {renderCreationTime}
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
