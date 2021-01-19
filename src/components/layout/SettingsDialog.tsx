import { useSettingsContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';
import { MainTemplateProps } from 'types';

import { SettingsList } from '../settings';
import { DialogHeader, SkoleDialog } from '../shared';

export const SettingsDialog: React.FC<Pick<MainTemplateProps, 'pageRef'>> = ({ pageRef }) => {
  const { t } = useTranslation();
  const { settingsDialogOpen, handleCloseSettingsDialog } = useSettingsContext();

  const renderDialogHeader = (
    <DialogHeader onCancel={handleCloseSettingsDialog} text={t('common:settings')} />
  );

  const renderSettingsList = <SettingsList dialog pageRef={pageRef} />;

  return (
    <SkoleDialog open={settingsDialogOpen} onClose={handleCloseSettingsDialog} list>
      {renderDialogHeader}
      {renderSettingsList}
    </SkoleDialog>
  );
};
