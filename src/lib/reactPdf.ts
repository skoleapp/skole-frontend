import { LTWH, PdfTranslation } from 'types';
import { MAX_SCALE, MIN_SCALE } from 'utils';

// Map interaction helpers.

// Return touch point on element.
export const getTouchPoint = (t: Touch): PdfTranslation => ({
  x: t.clientX,
  y: t.clientY,
});

// Return distance between points.
export const getDistance = (p1: PdfTranslation, p2: PdfTranslation): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};

// Get distance between fingers.
export const getTouchDistance = (t0: Touch, t1: Touch): number => {
  const p0 = getTouchPoint(t0);
  const p1 = getTouchPoint(t1);
  return getDistance(p0, p1);
};

// Get clamped scale if maximum scale has been exceeded.
export const getClampedScale = (value: number): number =>
  Math.max(MIN_SCALE, Math.min(value, MAX_SCALE));

// Get mid point between translation points.
export const getMidPoint = (p1: PdfTranslation, p2: PdfTranslation): PdfTranslation => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
});

// The amount that a value of a dimension will change given a new scale.
export const getCoordChange = (coordinate: number, scaleRatio: number): number =>
  scaleRatio * coordinate - coordinate;

// Area selection helpers.

// Get rectangle coordinates on container element.
export const getBoundingRect = (start: PdfTranslation, end: PdfTranslation): LTWH => ({
  left: Math.min(end.x, start.x),
  top: Math.min(end.y, start.y),
  width: Math.abs(end.x - start.x),
  height: Math.abs(end.y - start.y),
});

interface PageFromElement {
  node: HTMLElement;
  number: number;
}

// Find closest page canvas from DOM node.
export const getPageFromElement = (target: HTMLElement): PageFromElement | null => {
  const node = target.closest('.react-pdf__Page');

  if (node instanceof HTMLElement) {
    const number = Number(node.dataset.pageNumber);
    return { node, number };
  }
  return null;
};

// Converts a data URI string into a File object.
export const dataURItoFile = (dataURI: string): File => {
  const BASE64_MARKER = ';base64,';
  const mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
  const filename = `${'screenshot' + '.'}${mime.split('/')[1]}`;
  const bytes = atob(dataURI.split(BASE64_MARKER)[1]);
  const writer = new Uint8Array(new ArrayBuffer(bytes.length));

  for (let i = 0; i < bytes.length; i++) {
    writer[i] = bytes.charCodeAt(i);
  }

  return new File([writer.buffer], filename, { type: mime });
};
