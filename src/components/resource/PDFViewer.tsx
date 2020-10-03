import { Box, makeStyles, Typography } from '@material-ui/core';
import { usePDFViewerContext } from 'context';
import { useTranslation } from 'lib';
import { PDFDocumentProxy } from 'pdfjs-dist';
import React from 'react';
import { Document, Page } from 'react-pdf';

import { LoadingBox } from '..';
import { AreaSelection } from './AreaSelection';
import { MapInteraction } from './MapInteraction';

const useStyles = makeStyles(({ palette }) => ({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flexGrow: 1,
        display: 'flex',

        '& .react-pdf__Document': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& .react-pdf__Page, .react-pdf__Page__canvas': {
                margin: '0 auto',
                height: 'auto !important',
                width: '100% !important',
            },

            '& .react-pdf__message--loading, .react-pdf__message--no-data, .react-pdf__message--error': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: palette.common.white,
                display: 'flex',
                alignItems: 'center',
            },
        },
    },
}));

interface Props {
    file: string;
}

export const PDFViewer: React.FC<Props> = ({ file }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { documentRef, numPages, setPageNumber, setNumPages, rotate, setControlsDisabled } = usePDFViewerContext();

    const handleLoadSuccess = (document: PDFDocumentProxy): void => {
        const { numPages } = document;
        setNumPages(numPages);
        setPageNumber(1);
        setControlsDisabled(false);
    };

    const renderPages = Array.from(new Array(numPages), (_, i) => (
        <Page key={`page_${i + 1}`} pageNumber={i + 1} renderTextLayer={false} renderAnnotationLayer={false} />
    ));

    const renderAreaSelection = <AreaSelection />;
    const renderLoading = <LoadingBox text={t('resource:loadingResource')} />;

    const renderError = (
        <Box flexGrow="1" display="flex" justifyContent="center" alignItems="center">
            <Typography variant="body2" color="textSecondary">
                {t('resource:errorLoadingResource')}
            </Typography>
        </Box>
    );

    return (
        <Box flexGrow="1" position="relative" overflow="hidden">
            <Box className={classes.root}>
                <MapInteraction>
                    <Document
                        file={file}
                        onLoadSuccess={handleLoadSuccess}
                        loading={renderLoading}
                        error={renderError}
                        noData={renderError}
                        rotate={rotate}
                        ref={documentRef}
                    >
                        {renderPages}
                        {renderAreaSelection}
                    </Document>
                </MapInteraction>
            </Box>
        </Box>
    );
};
