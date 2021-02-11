import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { useDiscussionContext } from 'context';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React from 'react';
import { TOP_NAVBAR_HEIGHT_DESKTOP, TOP_NAVBAR_HEIGHT_MOBILE } from 'styles';
import { mediaLoader } from 'utils';

const useStyles = makeStyles(({ spacing, palette, breakpoints }) => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 3, // Overlap top and bottom navbars.
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
      padding: `${spacing(2)} ${spacing(4)}`,
    },
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
      <IconButton size="small" onClick={handleClose} color="secondary">
        <CloseOutlined />
      </IconButton>
    </Grid>
  );

  const renderAttachment = !!attachmentViewerValue && (
    <Grid item xs={12} container alignItems="center" justify="center">
      <Image
        width={1280}
        height={720}
        layout="intrinsic"
        loader={mediaLoader}
        src={attachmentViewerValue}
        alt={t('discussion:attachmentAlt')}
        objectFit="contain"
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
