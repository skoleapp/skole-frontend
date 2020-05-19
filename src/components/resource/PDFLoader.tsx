import { getDocument, PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useState } from 'react';

interface Props {
    url: string;
    beforeLoad: JSX.Element;
    children: (pdfDocument: PDFDocumentProxy) => JSX.Element;
    onError: (error: Error) => void;
}

import React from 'react';

export const PDFLoader: React.FC<Props> = ({ url, beforeLoad, children, onError }) => {
    const [document, setDocument] = useState<PDFDocumentProxy | null>(null);

    useEffect(() => {
        async (): Promise<void> => {
            try {
                const document = await getDocument({ url });
                setDocument((document as unknown) as PDFDocumentProxy);
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
