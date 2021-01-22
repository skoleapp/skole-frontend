import { useSettingsContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

import { SettingsList } from '../settings';
import { DialogHeader, Emoji, SkoleDialog } from '../shared';

export const SettingsDialog: React.FC = () => {
  const { t } = useTranslation();
  const { settingsDialogOpen, handleCloseSettingsDialog } = useSettingsContext();

  const header = (
    <>
      {t('common:settings')}
      <Emoji emoji="⚙️" />
    </>
  );

  const renderDialogHeader = <DialogHeader onCancel={handleCloseSettingsDialog} text={header} />;
  const renderSettingsList = <SettingsList dialog />;

  return (
    <SkoleDialog open={settingsDialogOpen} onClose={handleCloseSettingsDialog} list>
      {renderDialogHeader}
      {renderSettingsList}
    </SkoleDialog>
  );
};
