import { useSettingsContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

import { SettingsList } from '../shared';
import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

export const SettingsDialog: React.FC = () => {
  const { t } = useTranslation();
  const { settingsDialogOpen, handleCloseSettingsDialog } = useSettingsContext();

  return (
    <SkoleDialog open={settingsDialogOpen} onClose={handleCloseSettingsDialog} list>
      <DialogHeader onCancel={handleCloseSettingsDialog} text={t('common:settings')} emoji="⚙️" />
      <SettingsList dialog />
    </SkoleDialog>
  );
};
