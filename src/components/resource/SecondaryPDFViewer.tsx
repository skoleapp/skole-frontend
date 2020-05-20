import { Box } from '@material-ui/core';
import { useRouter } from 'next/router';
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Router } from '../../i18n';
import { Highlight, HighlightComment, LTWH, Scaled, ScaledPosition, ViewportHighlight } from '../../types';
import { LoadingBox } from '../shared';
import { AreaHighlight } from './AreaHighlight';
import { Highlight as HighlightComponent } from './Highlight';
import { HighlightPopup } from './HighlightPopup';
import { HighlightTip } from './HighlightTip';
import { mockedHighlights, mockedUrl } from './mock-data';
import { PDFHighlighter } from './PDFHighlighter';

interface Props {
    url?: string;
    highlights?: Highlight[];
}

export const SecondaryPDFViewer: React.FC<Props> = ({
    url = mockedUrl,
    highlights: initialHighlights = mockedHighlights,
}) => {
    const { t } = useTranslation();
    const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
    const [loading, setLoading] = useState(false);
    const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
    const { query, pathname } = useRouter();
    const resetHash = (): Promise<boolean> => Router.push(pathname);
    const scrollViewerToRef = useRef<Function | null>(null);
    const scrollViewerTo = scrollViewerToRef.current as Function;
    const getAreaSelection = (e: MouseEvent): boolean => !!e.altKey;

    const getHighlightById = (id: string | string[]): Highlight | undefined => {
        return highlights.find(highlight => highlight.id === id);
    };

    const addHighlight = (highlight: Omit<Highlight, 'id'>): void => {
        return setHighlights([...highlights, highlight as Highlight]);
    };

    const scrollToHighlight = (): void => {
        const highlight = getHighlightById(query.highlight);

        if (highlight) {
            scrollViewerTo(highlight);
        }
    };

    const fetchDocument = async (): Promise<void> => {
        setLoading(true);

        try {
            const document = await getDocument({ url }).promise;
            setDocument(document);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, []);

    useEffect(() => {
        scrollToHighlight();
    }, [query.highlight]);

    const updateHighlight = (highlightId: string, position: object, content: object): void => {
        const newHighlights = highlights.map(h =>
            h.id === highlightId
                ? {
                      ...h,
                      position: { ...h.position, ...position },
                      content: { ...h.content, ...content },
                  }
                : h,
        );

        setHighlights(newHighlights);
    };

    const handleScrollRef = (scrollTo: (highlight: Highlight) => void): void => {
        scrollViewerToRef.current = scrollTo;
        scrollToHighlight();
    };

    const handleSelectionFinished = (
        position: ScaledPosition,
        content: { text?: string; image?: string },
        hideTipAndSelection: () => void,
        transformSelection: () => void,
    ): JSX.Element => (
        <HighlightTip
            onOpen={transformSelection}
            onConfirm={(comment: { text: string; emoji: string }): void => {
                addHighlight({ content, position, comment });
                hideTipAndSelection();
            }}
        />
    );

    const handleHighlightTransform = (
        highlight: ViewportHighlight,
        index: number,
        setTip: (highlight: ViewportHighlight, callback: (highlight: ViewportHighlight) => JSX.Element) => void,
        hideTip: () => void,
        viewportToScaled: (boundingRect: LTWH) => Scaled,
        screenshot: (boundingRect: LTWH) => string,
        isScrolledTo: boolean,
    ): JSX.Element => {
        const isTextHighlight = !!highlight.content && !!highlight.content.image;

        const handleAreaHighlightChange = (boundingRect: LTWH): void => {
            updateHighlight(
                highlight.id,
                { boundingRect: viewportToScaled(boundingRect) },
                { image: screenshot(boundingRect) },
            );
        };

        const component = isTextHighlight ? (
            <HighlightComponent isScrolledTo={isScrolledTo} position={highlight.position} comment={highlight.comment} />
        ) : (
            <AreaHighlight highlight={highlight} onChange={handleAreaHighlightChange} />
        );

        const renderPopupContent = ({ text, emoji }: HighlightComment): JSX.Element => (
            <Box>
                {emoji} {text}
            </Box>
        );

        const handleMouseOver = (popupContent: JSX.Element): void => {
            setTip(highlight, () => popupContent);
        };

        return (
            <HighlightPopup
                popupContent={renderPopupContent(highlight.comment)}
                onMouseOver={handleMouseOver}
                onMouseOut={hideTip}
                key={index}
            >
                {component}
            </HighlightPopup>
        );
    };

    if (loading) {
        return <LoadingBox text={t('resource:loadingResource')} />;
    } else if (!!document) {
        return (
            <PDFHighlighter
                pdfDocument={document}
                enableAreaSelection={getAreaSelection}
                onScrollChange={resetHash}
                scrollRef={handleScrollRef}
                onSelectionFinished={handleSelectionFinished}
                highlightTransform={handleHighlightTransform}
                highlights={highlights}
            />
        );
    } else {
        return <p>{t('resource:errorLoadingResource')}</p>;
    }
};
