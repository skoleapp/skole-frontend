import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useInfoContext } from 'context';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';
import { ResponsiveDialog } from './ResponsiveDialog';

const useStyles = makeStyles(({ spacing }) => ({
  created: {
    marginTop: spacing(4),
  },
}));

export const InfoDialog: React.FC = () => {
  const {
    infoDialogOpen,
    handleCloseInfoDialog,
    infoDialogParams: { header, emoji, creator, created, infoItems },
  } = useInfoContext();

  const { t } = useTranslation();
  const classes = useStyles();
  const userId = R.prop('id', creator);
  const communityUser = t('common:communityUser');
  const createdBy = t('common:createdBy');

  const infoDialogHeaderProps = {
    text: header,
    emoji,
    onCancel: handleCloseInfoDialog,
  };

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
    <TextLink href={urls.user(userId)}>{creator.username}</TextLink>
  );

  const renderCreator = creator ? renderCreatorLink : communityUser;
  const renderCreationTime = useDayjs(created).startOf('day').fromNow();

  const renderCreated = !!created && (
    <Typography className={classes.created} variant="body2" color="textSecondary">
      {createdBy} {renderCreator} {renderCreationTime}
    </Typography>
  );

  return (
    <ResponsiveDialog
      open={infoDialogOpen}
      onClose={handleCloseInfoDialog}
      dialogHeaderProps={infoDialogHeaderProps}
    >
      <CardContent>
        {renderInfoItems}
        {renderCreated}
      </CardContent>
    </ResponsiveDialog>
  );
};
