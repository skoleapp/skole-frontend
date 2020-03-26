import { Box, CircularProgress, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import styled from 'styled-components';

interface Props {
    file: string;
}

interface PDFDocument {
    numPages: number;
}

export const PDFViewer: React.FC<Props> = ({ file }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const onDocumentLoadSuccess = ({ numPages }: PDFDocument): void => setNumPages(numPages);

    const renderLoading = (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
            <CircularProgress color="primary" />
            <Box marginLeft="1rem">
                <Typography variant="subtitle1">Loading Document...</Typography>
            </Box>
        </Box>
    );

    return (
        <StyledFilePreview>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading={renderLoading}>
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
