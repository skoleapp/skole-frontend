import { Box, Typography } from '@material-ui/core';
import { usePDFViewerContext } from 'context';
import { PDFDocumentProxy } from 'pdfjs-dist';
import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page } from 'react-pdf';
import styled from 'styled-components';
import { breakpoints } from 'styles';

import { LoadingBox } from '..';
import { AreaSelection } from './AreaSelection';
import { MapInteraction } from './MapInteraction';

interface Props {
    file: string;
}

export const PDFViewer: React.FC<Props> = ({ file }) => {
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
        <StyledPDFViewer>
            <MapInteraction>
                <Document
                    file={file}
                    onLoadSuccess={handleLoadSuccess}
                    loading={renderLoading}
                    error={renderError}
                    noData={renderError}
                    rotate={rotate}
                    ref={documentRef as RefObject<Document>}
                >
                    {renderPages}
                    {renderAreaSelection}
                </Document>
            </MapInteraction>
        </StyledPDFViewer>
    );
};

const StyledPDFViewer = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    flex-grow: 1;
    display: flex;

    // Push content down because of toolbar on desktop.
    @media only screen and (min-width: ${breakpoints.MD}) {
        top: 3rem;
    }

    .react-pdf__Document {
        display: flex;
        flex-direction: column;
        align-items: center;

        .react-pdf__Page,
        .react-pdf__Page__canvas {
            margin: 0 auto !important;
            height: auto !important;
            width: 100% !important;
        }

        .react-pdf__message--loading,
        .react-pdf__message--no-data,
        .react-pdf__message--error {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: var(--white);
            display: flex;
        }
    }
`;
