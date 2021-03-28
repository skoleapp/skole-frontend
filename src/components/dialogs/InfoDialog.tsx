import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useInfoContext } from 'context';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { useMemo } from 'react';
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
    infoDialogParams: { header, emoji, creator, created = '', infoItems },
  } = useInfoContext();

  const { t } = useTranslation();
  const classes = useStyles();
  const slug = R.prop('slug', creator);
  const communityUser = t('common:communityUser');
  const createdBy = t('common:createdBy');

  const infoDialogHeaderProps = {
    text: header,
    emoji,
    onCancel: handleCloseInfoDialog,
  };

  const renderInfoItems = useMemo(
    () =>
      infoItems.map(({ label, value }, i) => (
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
      )),
    [infoItems],
  );

  const renderCreatorLink = useMemo(
    () => !!creator && <TextLink href={urls.user(slug)}>{creator.username}</TextLink>,
    [creator, slug],
  );

  const renderCreator = useMemo(() => (creator ? renderCreatorLink : communityUser), [
    communityUser,
    creator,
    renderCreatorLink,
  ]);

  const renderCreationTime = useDayjs(created).startOf('day').fromNow();

  const renderCreated = useMemo(
    () =>
      !!created && (
        <Typography className={classes.created} variant="body2" color="textSecondary">
          {createdBy} {renderCreator} {renderCreationTime}
        </Typography>
      ),
    [classes.created, created, createdBy, renderCreationTime, renderCreator],
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
