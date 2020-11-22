import { Backdrop, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { useDiscussionContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';
import { TOP_NAVBAR_HEIGHT_DESKTOP, TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { mediaUrl } from 'utils';

const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 9999,
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexWrap: 'nowrap',
  },
  toolbar: {
    height: TOP_NAVBAR_HEIGHT_MOBILE,
    width: '100%',
    padding: spacing(2),
    backgroundColor: palette.common.black,
    flexBasis: 'auto',
    [breakpoints.up('md')]: {
      height: TOP_NAVBAR_HEIGHT_DESKTOP,
    },
  },
  imageContainer: {
    flexGrow: 1,
    display: 'flex',
    paddingTop: spacing(4),
    paddingBottom: `calc(${spacing(4)} + ${TOP_NAVBAR_HEIGHT_MOBILE})`,
    [breakpoints.up('md')]: {
      paddingBottom: `calc(${spacing(4)} + ${TOP_NAVBAR_HEIGHT_DESKTOP})`,
    },
  },
  image: {
    width: '100%',
    maxWidth: '40rem',
    height: 'auto',
    margin: '0 auto',
  },
  iconButton: {
    padding: spacing(1),
  },
}));

export const AttachmentViewer: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { attachmentViewerValue, setAttachmentViewerValue } = useDiscussionContext();

  const attachmentName = attachmentViewerValue && attachmentViewerValue.split('/').pop();

  const handleClose = (): void => setAttachmentViewerValue(null);

  const renderToolbar = (
    <Grid
      item
      xs={12}
      container
      className={classes.toolbar}
      alignItems="center"
      justify="space-between"
    >
      <Typography className="truncate-text" variant="subtitle1" color="secondary">
        {attachmentName}
      </Typography>
      <IconButton className={classes.iconButton} onClick={handleClose} color="secondary">
        <CloseOutlined />
      </IconButton>
    </Grid>
  );

  // TODO: Replace this with `next/image`. As of now (v10.0.1), having the image source in our backend media folder does not work with the `next/image`.
  const renderAttachment = !!attachmentViewerValue && (
    <Grid
      item
      xs={12}
      container
      alignItems="center"
      justify="center"
      className={classes.imageContainer}
    >
      <img
        className={classes.image}
        src={mediaUrl(attachmentViewerValue)}
        alt={t('common:commentAttachment')}
      />
    </Grid>
  );

  return (
    <Backdrop className={classes.root} open={!!attachmentViewerValue} onClick={handleClose}>
      <Grid container direction="column" className={classes.container}>
        {renderToolbar}
        {renderAttachment}
      </Grid>
    </Backdrop>
  );
};
