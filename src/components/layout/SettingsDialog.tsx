import { useSettings } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { DialogHeader, SkoleDialog } from '../shared';

export const SettingsDialog: React.FC = () => {
  const { t } = useTranslation();
  const { renderSettingsMenuList, settingsOpen, toggleSettings } = useSettings(true);
  const handleClose = (): void => toggleSettings(false);
  const renderDialogHeader = <DialogHeader onCancel={handleClose} text={t('common:settings')} />;

  return (
    <SkoleDialog open={settingsOpen} onClose={handleClose} list>
      {renderDialogHeader}
      {renderSettingsMenuList}
    </SkoleDialog>
  );
};
