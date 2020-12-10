export interface PdfDocumentProxy {
  numPages: number;
}

export interface LTWH {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PdfTranslation {
  x: number;
  y: number;
}

export interface PdfViewerProps {
  file: string;
}
