import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { useThreadContext } from 'context';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React, { useCallback, useMemo } from 'react';
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
  imageContainer: {
    position: 'relative',
    marginBottom: 'env(safe-area-inset-bottom)',
  },
  toolbar: {
    height: TOP_NAVBAR_HEIGHT_MOBILE,
    width: '100%',
    padding: spacing(2),
    paddingLeft: `calc(${spacing(2)} + env(safe-area-inset-left))`,
    paddingRight: `calc(${spacing(2)} + env(safe-area-inset-right))`,
    backgroundColor: palette.common.black,
    flexBasis: 'auto',
    [breakpoints.up('md')]: {
      height: TOP_NAVBAR_HEIGHT_DESKTOP,
      padding: `${spacing(2)} ${spacing(4)}`,
    },
  },
}));

export const ImageViewer: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    commentImageViewerValue,
    threadImageViewerValue,
    setCommentImageViewerValue,
    setThreadImageViewerValue,
  } = useThreadContext();

  const imageViewerValue = threadImageViewerValue || commentImageViewerValue || '';

  const alt =
    (commentImageViewerValue && t('alt-text:commentImage')) ||
    (threadImageViewerValue && t('alt-text:threadImage')) ||
    '';

  const handleClose = useCallback((): void => {
    if (commentImageViewerValue) {
      setCommentImageViewerValue(null);
    } else if (threadImageViewerValue) {
      setThreadImageViewerValue(null);
    }
  }, [
    commentImageViewerValue,
    setCommentImageViewerValue,
    setThreadImageViewerValue,
    threadImageViewerValue,
  ]);

  const renderToolbar = useMemo(
    () => (
      <Grid
        item
        xs={12}
        container
        className={classes.toolbar}
        alignItems="center"
        justify="flex-end"
        wrap="nowrap"
      >
        <IconButton size="small" onClick={handleClose} color="secondary">
          <CloseOutlined />
        </IconButton>
      </Grid>
    ),
    [classes.toolbar, handleClose],
  );

  const renderImage = useMemo(
    () =>
      !!imageViewerValue && (
        <Grid
          className={classes.imageContainer}
          item
          xs={12}
          container
          alignItems="center"
          justify="center"
        >
          <Image
            layout="fill"
            loader={mediaLoader}
            src={imageViewerValue}
            alt={alt}
            objectFit="contain"
          />
        </Grid>
      ),
    [imageViewerValue, alt, classes.imageContainer],
  );

  return (
    <Backdrop className={classes.root} open={!!imageViewerValue} onClick={handleClose}>
      <Grid container direction="column" className={classes.container}>
        {renderToolbar}
        {renderImage}
      </Grid>
    </Backdrop>
  );
};
