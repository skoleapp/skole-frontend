import { useNotificationsContext } from 'context';
import { useTranslation } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import { useEffect } from 'react';
import React from 'react';
import { Workbox } from 'workbox-window';

interface WorkboxWindow extends Window {
    workbox: Workbox;
}

export const PWAProvider: React.FC = ({ children }) => {
    const { t } = useTranslation();
    const confirm = useConfirm();
    const { toggleNotification } = useNotificationsContext();
    const updateContent = (): void => window.location.reload();

    useEffect(() => {
        const { workbox } = (window as unknown) as WorkboxWindow;

        const promptUpdateContent = async (): Promise<void> => {
            try {
                await confirm({ title: t('alerts:newVersionTitle'), description: t('alerts:newVersionDesc') });
                workbox.addEventListener('controlling', updateContent);
                workbox.messageSW({ type: 'SKIP_WAITING' });
                toggleNotification(t('notifications:appUpdated'));
            } catch {
                // User rejected, new version will be automatically loaded when user opens the app next time.
            }
        };

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && workbox !== undefined) {
            workbox.addEventListener('waiting', promptUpdateContent);
            workbox.register();
        }
    }, []);

    return <>{children}</>;
};
