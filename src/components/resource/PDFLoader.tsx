import { getDocument, PDFDocumentProxy, PDFLoadingTask } from 'pdfjs-dist';
import { ReactElement, useEffect, useState } from 'react';

interface Props {
    url: string;
    beforeLoad: ReactElement;
    children: (pdfDocument: PDFLoadingTask<PDFDocumentProxy>) => ReactElement;
    onError: (error: Error) => void;
}

import React from 'react';

export const PDFLoader: React.FC<Props> = ({ url, beforeLoad, children, onError }) => {
    const [document, setDocument] = useState<PDFLoadingTask<PDFDocumentProxy> | null>(null);

    useEffect(() => {
        async (): Promise<void> => {
            try {
                const document = await getDocument({ url });
                setDocument(document);
            } catch (err) {
                onError(err);
            }
        };
    }, []);

    if (!!document) {
        return children(document);
    }

    return beforeLoad;
};
