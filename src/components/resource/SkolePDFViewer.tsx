import { Box } from '@material-ui/core';
import { PDFDocumentProxy } from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { LTWH } from 'src/types';

interface Coords {
    x: number;
    y: number;
}

interface State {
    locked: boolean;
    start: Coords | null;
    end: Coords | null;
}

interface MouseSelectionProps {
    onSelection: (startTarget: HTMLElement, boundingRect: LTWH) => void;
    onChange: (isVisible: boolean) => void;
}

const initialState = { start: null, end: null, locked: false };

const MouseSelection: React.FC<MouseSelectionProps> = ({ onSelection, onChange }) => {
    const [state, setState] = useState<State>(initialState);
    const { start, end, locked } = state;
    const ref = useRef<HTMLDivElement>(null);

    const getBoundingRect = (start: Coords, end: Coords): LTWH => ({
        left: Math.min(end.x, start.x),
        top: Math.min(end.y, start.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    });

    useEffect(() => {
        const isVisible = !!start && !!end;
        onChange(isVisible);
    }, []);

    useEffect(() => {
        const container = !!ref.current && ref.current.parentElement;

        if (!!container) {
            // Get coordinates on container element.
            const containerCoords = (pageX: number, pageY: number): Coords => {
                const { left, top } = container.getBoundingClientRect();

                return {
                    x: pageX - left + container.scrollLeft,
                    y: pageY - top + container.scrollTop,
                };
            };

            container.addEventListener('mousedown', (e: MouseEvent) => {
                // Reset state if Alt-key is not pressed.
                if (!e.altKey) {
                    setState(initialState);
                }

                setState({
                    start: containerCoords(e.pageX, e.pageY),
                    end: null,
                    locked: false,
                });
            });

            container.addEventListener('mousemove', (e: MouseEvent) => {
                if (!!start && !locked) {
                    setState({
                        ...state,
                        end: containerCoords(e.pageX, e.pageY),
                    });
                }
            });

            document.addEventListener('mouseup', (e: MouseEvent): void => {
                if (start) {
                    const end = containerCoords(e.pageX, e.pageY);
                    const boundingRect = getBoundingRect(start, end);

                    // Target out of bounds or Alt-key released.
                    if (!container.contains(e.target as Node) || !e.altKey) {
                        setState(initialState);
                        return;
                    }

                    // Lock state.
                    setState({
                        ...state,
                        end,
                        locked: true,
                    });

                    if (!!start && !!end) {
                        onSelection(startTarget, boundingRect);
                        setState(initialState);
                    }
                }
            });
        }
    }, []);

    const renderRect = start && end && <Box style={getBoundingRect(start, end)} />;
    return <div ref={ref}>{renderRect}</div>;
};

interface PDFViewerProps {
    file: string;
}

interface PDFViewerState {
    document: PDFDocumentProxy | null;
    numPages: number | null;
    drawing: boolean;
}

export const SkolePDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
    const [state, setState] = useState<PDFViewerState>({
        document: null,
        numPages: null,
        drawing: false,
    });

    const { numPages } = state;

    const onDocumentLoadSuccess = (document: PDFDocumentProxy): void => {
        const { numPages } = document;
        setState({ ...state, document });
        setState({ ...state, numPages });
    };

    const handleMouseSelectionChange = (drawing: boolean): void => {
        setState({ ...state, drawing });
    };

    const handleSelection = async (startTarget: HTMLElement, boundingRect: LTWH): Promise<void> => {
        console.log('start target', startTarget);
        console.log('bounding rect', boundingRect);
    };

    const renderPages = Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
    ));

    const renderMouseSelection = <MouseSelection onChange={handleMouseSelectionChange} onSelection={handleSelection} />;

    return (
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {renderPages}
            {renderMouseSelection}
        </Document>
    );
};
