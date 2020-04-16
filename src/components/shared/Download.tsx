import { Button } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import React, { useState } from 'react';

import { useNotificationsContext } from '../../context';
import { useTranslation } from '../../i18n';

interface Props {
    url: string;
    fileName: string;
}

export const Download: React.FC<Props> = ({ url, fileName }) => {
    const [fetching, setFetching] = useState(false);
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();

    const handleClick = async (): Promise<void> => {
        setFetching(true);

        try {
            const res = await fetch(url);
            const blob = await res.blob();
            setFetching(false);
            const blobURL = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobURL;
            a.style.display = 'none';
            if (fileName && fileName.length) a.download = fileName;
            document.body.appendChild(a);
            a.click();
        } catch {
            toggleNotification(t('notification:errorDownLoadingResource'));
        }
    };

    return (
        <Button
            color="primary"
            variant="outlined"
            endIcon={<CloudDownload />}
            disabled={fetching}
            onClick={handleClick}
        >
            {t('common:download')}
        </Button>
    );
};
