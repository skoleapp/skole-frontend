import { Box, CircularProgress, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';

interface Props {
    file: string;
}

interface PDFDocument {
    numPages: number;
}

export const PDFViewer: React.FC<Props> = ({ file }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const onDocumentLoadSuccess = ({ numPages }: PDFDocument): void => setNumPages(numPages);
    const { t } = useTranslation();

    const renderLoading = (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
            <CircularProgress color="primary" />
            <Box marginLeft="1rem">
                <Typography variant="subtitle1">{t('resource:loadingResource')}</Typography>
            </Box>
        </Box>
    );

    const renderError = (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
            <Typography variant="subtitle1">{t('resource:resourceError')}</Typography>
        </Box>
    );

    const renderNoData = (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
            <Typography variant="subtitle1">{t('resource:resourceNotFound')}</Typography>
        </Box>
    );

    return (
        <StyledFilePreview>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={renderLoading}
                error={renderError}
                noData={renderNoData}
            >
                {Array.from(new Array(numPages), (_el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        </StyledFilePreview>
    );
};

const StyledFilePreview = styled(Box)`
    position: relative;
    flex-grow: 1;

    .react-pdf__Document {
        overflow-y: scroll;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        canvas {
            width: 100% !important;
            height: 100% !important;
        }
    }
`;
