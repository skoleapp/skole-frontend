import { makeStyles } from '@material-ui/core';
import { useSettings } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { DialogHeader, SkoleDialog } from '../shared';

const useStyles = makeStyles(({ breakpoints }) => ({
  paper: {
    [breakpoints.up('md')]: {
      paddingBottom: '3rem',
    },
  },
}));

export const SettingsModal: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { renderSettingsMenuList, settingsOpen, toggleSettings } = useSettings(true);
  const handleClose = (): void => toggleSettings(false);
  const renderDialogHeader = <DialogHeader onCancel={handleClose} text={t('common:settings')} />;

  return (
    <SkoleDialog open={settingsOpen} onClose={handleClose} paperClasses={classes.paper}>
      {renderDialogHeader}
      {renderSettingsMenuList}
    </SkoleDialog>
  );
};
