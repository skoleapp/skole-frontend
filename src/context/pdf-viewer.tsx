import React, { createContext, MutableRefObject, useRef, useState } from 'react';
import { useContext } from 'react';
import { Document } from 'react-pdf';
import SwipeableViews from 'react-swipeable-views';
import { PDFViewerContextType } from 'types';

const PDFViewerContext = createContext<PDFViewerContextType>({});
export const usePDFViewerContext = (): PDFViewerContextType => useContext(PDFViewerContext);

export const PDFViewerContextProvider: React.FC = ({ children }) => {
    const documentRef = useRef<Document>(null!);
    const pageNumberInputRef = useRef<HTMLInputElement>(null!);
    const [controlsDisabled, setControlsDisabled] = useState(true);
    const [drawMode, setDrawMode] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [rotate, setRotate] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [swipingDisabled, setSwipingDisabled] = useState(false);
    const swipeableViewsRef = (useRef(null!) as unknown) as MutableRefObject<SwipeableViews> & string;

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
        swipingDisabled,
        setSwipingDisabled,
        swipeableViewsRef,
    };

    return <PDFViewerContext.Provider value={value}>{children}</PDFViewerContext.Provider>;
};
