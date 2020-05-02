// Makke fix this pls

import { useConfirm } from 'material-ui-confirm';
import { useEffect, FunctionComponent, ReactElement } from 'react';
import { Workbox } from 'workbox-window';

import { useTranslation } from './i18n';

interface Props {
    children: ReactElement;
}

export const ServiceWrapper: FunctionComponent<Props> = ({ children }): ReactElement => {
    const { t } = useTranslation();
    const confirm = useConfirm();

    useEffect(() => {
        //Property 'workbox' does not exist on type 'Window & typeof globalThis'.
        //@ts-ignore
        const workbox: Workbox = window.workbox;
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && workbox !== undefined) {
            workbox.addEventListener('waiting', () => {
                confirm({
                    title: t('common:newVersionAvailable'),
                    confirmationText: t('common:confirmUpdate'),
                    cancellationText: t('common:declineUpdate'),
                })
                    .then(() => {
                        workbox.addEventListener('controlling', () => {
                            window.location.reload();
                        });
                        workbox.messageSW({ type: 'SKIP_WAITING' });
                    })
                    .catch((err: string) => {
                        console.log(err);
                    });
            });
            workbox.register();
        }
    }, []);

    return children;
};
