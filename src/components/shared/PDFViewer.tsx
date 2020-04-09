import { Box } from '@material-ui/core';
import { Image as olImage, Map as olMap, View as olView } from 'ol';
import { Coordinate as olCoordinate } from 'ol/coordinate';
import { Extent as olExtent } from 'ol/extent';
import { Group as olGroup } from 'ol/layer';
import { ProjectionLike as olProjection } from 'ol/proj';
import { ImageStatic as olImageStatic } from 'ol/source';
import PDFJS, { PDFDocumentProxy, PDFPageProxy, PDFPromise } from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { NEXT_PAGE, PREV_PAGE, resetEffect, SET_CENTER, setCurrentPage, setPages } from '../../actions';
import { State } from '../../types';
import { Loading } from './Loading';

interface Props {
    file: string;
}
export interface Page {
    layer: olGroup;
    imageExtent: olExtent;
}
export interface Pages {
    pages: Page[];
}

export const PDFViewer: React.FC<Props> = ({ file }) => {
    const [touchStart, setTouchStart] = useState<number | null>(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [initialZoom, setInitialZoom] = useState(0);

    const [currentMap, setCurrentMap] = useState<olMap | null>(null);

    const dispatch = useDispatch();

    const { pages, currentPage, effect } = useSelector((state: State) => state.resource);
    const ref = useRef<HTMLDivElement | null>(null);

    const handleTouchStart = (e: TouchEvent): void => {
        if (e.touches.length === 1) {
            const startCoordX = e.changedTouches[0].screenX;
            setTouchStart(startCoordX);
        } else {
            setTouchStart(null);
        }
    };
    const handleTouchEnd = (e: TouchEvent): void => {
        const endCoordX = e.changedTouches[0].screenX;
        setTouchEnd(endCoordX);
    };

    const getCenter = (extent: olExtent): olCoordinate => {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    };

    const setCenter = (): void => {
        if (!!currentMap) {
            currentMap.getView().setCenter(getCenter(pages[currentPage].imageExtent));
            currentMap.getView().setZoom(0);
        }
    };

    const nextPage = (): void => {
        const numPages = pages.length;

        if (currentPage < numPages - 1 && !!currentMap) {
            const nextPage = currentPage + 1;
            currentMap.setLayerGroup(pages[nextPage].layer);
            dispatch(setCurrentPage(nextPage));
        }
    };
    const previousPage = (): void => {
        if (currentPage !== 0 && !!currentMap) {
            const previousPage = currentPage - 1;
            currentMap.setLayerGroup(pages[previousPage].layer);
            dispatch(setCurrentPage(previousPage));
        }
    };

    const createPagesFromPDF = (url: string): PDFPromise<PDFPromise<PDFPromise<Page>>[]> => {
        const Image = require('ol/layer/Image').default;
        const ImageStatic = require('ol/source/ImageStatic').default;
        const Projection = require('ol/proj/Projection').default;
        const Group = require('ol/layer/Group').default;

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const PDFJSWorker = require('pdfjs-dist/build/pdf.worker.min');
        PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;

        const renderPage = (page: PDFPageProxy): PDFPromise<Page> => {
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
                throw new Error('Failed to get 2D context');
            }
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            return page.render(renderContext).promise.then(() => {
                const imageWidth = canvas.width;
                const imageHeight = canvas.height;

                const imageExtent: olExtent = [0, 0, imageWidth, imageHeight];

                const projection: olProjection = new Projection({
                    code: 'pixel',
                    units: 'pixels',
                    extent: imageExtent,
                });

                const source: olImageStatic = new ImageStatic({
                    projection: projection,
                    imageExtent: imageExtent,
                    crossOrigin: 'anonymous',
                    url: canvas.toDataURL(),
                });

                const imageLayer: olImage = new Image({
                    source: source,
                });

                const layer: olGroup = new Group({
                    layers: [imageLayer],
                });

                if (page.pageIndex === 0) {
                    //
                }

                const mapData: Page = { layer: layer, imageExtent: imageExtent };

                return mapData;
            });
        };
        const renderPages = (PDFJSPages: PDFDocumentProxy): PDFPromise<PDFPromise<Page>>[] => {
            const promises = [];

            for (let index = 1; index <= PDFJSPages.numPages; index++) {
                const newPage = PDFJSPages.getPage(index).then(renderPage);

                promises.push(newPage);
            }

            return promises;
        };

        return PDFJS.getDocument(url).promise.then((PDFJSPages: PDFDocumentProxy) => {
            return renderPages(PDFJSPages);
        });
    };

    useEffect(() => {
        if (!!currentMap) {
            const zoomLevel = currentMap.getView().getZoom();

            if (initialZoom >= zoomLevel && !!touchStart) {
                if (touchEnd < touchStart - 50) {
                    nextPage();
                } else if (touchEnd > touchStart + 50) {
                    previousPage();
                }
            }
        }
    }, [touchEnd]);

    useEffect(() => {
        if (!!ref.current) {
            ref.current.addEventListener('touchstart', handleTouchStart, false);
            ref.current.addEventListener('touchend', handleTouchEnd, false);
        }

        return (): void => {
            if (!!ref.current) {
                ref.current.removeEventListener('touchstart', handleTouchStart, false);
                ref.current.removeEventListener('touchend', handleTouchEnd, false);
            }
        };
    }, [ref.current]);

    const createMap = (imageExtent: olExtent): olMap => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Projection = require('ol/proj/Projection').default;

        const projection: olProjection = new Projection({
            code: 'pixel',
            units: 'pixels',
            extent: imageExtent,
        });

        const view: olView = new View({
            projection: projection,
            zoom: 0,
            maxZoom: 4,
            constrainResolution: false,
            showFullExtent: true,
            enableRotation: false,
            extent: imageExtent,
        });

        const map: olMap = new Map({
            view: view,
            controls: [],
        });

        return map;
    };

    useEffect(() => {
        if (pages.length === 0) {
            if (!!file) {
                const url = file;
                try {
                    const pdfMaps = createPagesFromPDF(url);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    pdfMaps.then((pdfMaps: any) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        Promise.all(pdfMaps).then((pdfMaps: any) => {
                            const imageExtent = pdfMaps[0].imageExtent;
                            const layer = pdfMaps[0].layer;

                            const map = createMap(imageExtent);
                            map.setLayerGroup(layer);
                            if (!!ref.current) {
                                map.setTarget(ref.current);
                            }
                            map.getView().setCenter(getCenter(pdfMaps[0].imageExtent));
                            map.getView().setZoom(0); //?
                            setCurrentMap(map);

                            const zoomLevel = map.getView().getZoom();
                            setInitialZoom(zoomLevel);
                            dispatch(setPages(pdfMaps));
                        });
                    });
                } catch {
                    (err: string): void => console.log(err);
                }
            }
        } else {
            const imageExtent = pages[currentPage].imageExtent;
            const layer = pages[currentPage].layer;

            const map = createMap(imageExtent);
            map.setLayerGroup(layer);
            if (!!ref.current) {
                map.setTarget(ref.current);
            }
            map.getView().setCenter(getCenter(imageExtent));
            map.getView().setZoom(0); //?
            setCurrentMap(map);

            const zoomLevel = map.getView().getZoom();
            setInitialZoom(zoomLevel);
        }
    }, []);

    useEffect(() => {
        switch (effect) {
            case SET_CENTER:
                setCenter();
                dispatch(resetEffect());
                break;
            case PREV_PAGE:
                previousPage();
                dispatch(resetEffect());
                break;
            case NEXT_PAGE:
                nextPage();
                dispatch(resetEffect());
                break;
            default:
                break;
        }
    }, [effect]);

    return (
        <StyledPDFViewer>
            <div id="pdf-container" ref={ref}></div>
            <Loading />
        </StyledPDFViewer>
    );
};

const StyledPDFViewer = styled(Box)`
    position: relative;
    display: flex;
    flex: 1 1 auto;

    #pdf-container {
        background-color: rgb(72, 76, 79, 0.7);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: auto;
        z-index: 2;
    }
`;

export default PDFViewer;
