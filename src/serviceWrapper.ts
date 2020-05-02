// Makke fix this pls

import { useTranslation } from './i18n';
import { useConfirm } from 'material-ui-confirm';
import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

//@ts-ignore
export const ServiceWrapper = ({ children }: any) => {
    const { t } = useTranslation();
    const confirm = useConfirm();

    useEffect(() => {
        //Property 'workbox' does not exist on type 'Window & typeof globalThis'.
        //@ts-ignore
        const workbox: Workbox = window.workbox;
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && workbox !== undefined) {
            workbox.addEventListener('waiting', _ => {
                confirm({
                    title: t('common:newVersionAvailable'),
                    confirmationText: t('common:confirmUpdate'),
                    cancellationText: t('common:declineUpdate'),
                }).then(() => {
                    workbox.addEventListener('controlling', _ => {
                        window.location.reload();
                    });
                    workbox.messageSW({ type: 'SKIP_WAITING' });
                });
            });
            workbox.register();
        }
    }, []);

    return children;
};
