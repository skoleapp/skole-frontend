import React, { useState } from 'react';

import { Button } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';
import { openNotification } from '../../actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const download = async (url: string, name: string): Promise<void> => {
        setFetching(true);

        try {
            const res = await fetch(url);
            const blob = await res.blob();
            setFetching(false);
            const blobURL = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobURL;
            a.style.display = 'none';
            if (name && name.length) a.download = name;
            document.body.appendChild(a);
            a.click();
        } catch {
            dispatch(openNotification(t('notification:errorDownLoadingResource')));
        }
    };

    const handleClick = (): Promise<void> => download(url, fileName);

    return (
        <Button
            variant="outlined"
            color="primary"
            endIcon={<CloudDownload />}
            disabled={fetching}
            onClick={handleClick}
            fullWidth
        >
            {t('common:download')}
        </Button>
    );
};
