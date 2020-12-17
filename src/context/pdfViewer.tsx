import React, { createContext, useRef, useState, useContext } from 'react';

import { Document } from 'react-pdf';
import { PdfViewerContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const PdfViewerContext = createContext<PdfViewerContextType>({});

export const usePdfViewerContext = (): PdfViewerContextType => useContext(PdfViewerContext);

export const PdfViewerContextProvider: React.FC = ({ children }) => {
  const documentRef = useRef<Document>(null!);
  const pageNumberInputRef = useRef<HTMLInputElement>(null!);
  const [controlsDisabled, setControlsDisabled] = useState(true);
  const [drawMode, setDrawMode] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [rotate, setRotate] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const value = {
    documentRef,
    pageNumberInputRef,
    controlsDisabled,
    setControlsDisabled,
    drawMode,
    setDrawMode,
    screenshot,
    setScreenshot,
    rotate,
    setRotate,
    numPages,
    setNumPages,
    pageNumber,
    setPageNumber,
  };

  return <PdfViewerContext.Provider value={value}>{children}</PdfViewerContext.Provider>;
};
