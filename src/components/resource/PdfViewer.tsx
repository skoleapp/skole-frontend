import { Box, makeStyles, Typography } from '@material-ui/core';
import { usePdfViewerContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { BORDER } from 'theme';
import { PdfDocumentProxy, PdfViewerProps } from 'types';
import { PDF_DEFAULT_SCALE, PDF_DEFAULT_TRANSLATION } from 'utils';
import { LoadingBox } from '../shared';
import { AreaSelection } from './AreaSelection';
import { MapControls } from './MapControls';
import { MapInteraction } from './MapInteraction';
import { PageNumberInput } from './PageNumberInput';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles(({ palette, breakpoints }) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    [breakpoints.up('md')]: {
      marginBottom: '3rem',
      borderBottom: BORDER,
    },
    '& .react-pdf__Document': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& .react-pdf__Page, .react-pdf__Page__canvas, .react-pdf__Page__textContent': {
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

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const [scale, setScale] = useState(PDF_DEFAULT_SCALE);
  const [translation, setTranslation] = useState(PDF_DEFAULT_TRANSLATION);

  const mapInteractionProps = {
    scale,
    setScale,
    setTranslation,
    translation,
  };

  const mapControlsProps = {
    scale,
    setScale,
    setTranslation,
  };

  const {
    documentRef,
    numPages,
    setPageNumber,
    setNumPages,
    rotate,
    setControlsDisabled,
    drawMode,
    controlsDisabled,
  } = usePdfViewerContext();

  const handleLoadSuccess = (document: PdfDocumentProxy): void => {
    const { numPages } = document;
    setNumPages(numPages);
    setPageNumber(1);
    setControlsDisabled(false);
  };

  const renderPages = Array.from(new Array(numPages), (_, i) => (
    <Page key={`page_${i + 1}`} pageNumber={i + 1} />
  ));

  const renderAreaSelection = <AreaSelection />;
  const renderLoading = <LoadingBox />;

  const renderError = (
    <Box flexGrow="1" display="flex" justifyContent="center" alignItems="center">
      <Typography variant="body2" color="textSecondary">
        {t('resource:error')}
      </Typography>
    </Box>
  );

  const renderMapInteraction = (
    <MapInteraction {...mapInteractionProps}>
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
  );

  // TODO: See if we need to add a check for `drawMode` here.
  const renderPageNumberInput = isTabletOrDesktop && !controlsDisabled && <PageNumberInput />;

  // TODO: See if we can use only `controlsDisabled` or `drawMode`.
  const renderMapControls = isTabletOrDesktop && !drawMode && !controlsDisabled && (
    <MapControls {...mapControlsProps} />
  );

  return (
    <Box className={classes.root}>
      {renderMapInteraction}
      {renderMapControls}
      {renderPageNumberInput}
    </Box>
  );
};

export default PdfViewer;
