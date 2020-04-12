import { Button } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import React, { useState } from 'react';

import { useSkoleContext } from '../../context';
import { useTranslation } from '../../i18n';

interface Props {
    url: string;
    fileName: string;
}

/**
 * Modern browsers can download files that aren't from same origin this is a workaround to download a remote file.
 * src: https://medium.com/charisol-community/downloading-resources-in-html5-a-download-may-not-work-as-expected-bf63546e2baa
 */
export const Download: React.FC<Props> = ({ url, fileName }) => {
    const [fetching, setFetching] = useState(false);
    const { toggleNotification } = useSkoleContext();
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
