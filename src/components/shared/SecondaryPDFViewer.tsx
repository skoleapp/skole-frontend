import 'ol/ol.css';

import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';

import { NEXT_PAGE, PREV_PAGE, SET_CENTER, setCurrentPage, setPages } from '../../actions';
import { State } from '../../types';

/* eslint-disable */
interface Props {
    file: string;
}

export const ResourcePreview: React.FC<Props> = ({ file }) => {
    const [touchStart, setTouchStart]: any = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [initialZoom, setInitialZoom] = useState(0);

    const dispatch = useDispatch();

    const { pages, currentPage, effect } = useSelector((state: State) => state.resource);

    useEffect(() => {
        switch (effect) {
            case SET_CENTER:
                setCenter();
                break;
            case PREV_PAGE:
                previousPage();
                break;
            case NEXT_PAGE:
                nextPage();
                break;
            default:
                break;
        }
    }, [effect]);

    const ref = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: any): void => {
        if (e.touches.length === 1) {
            const startCoordX = e.changedTouches[0].screenX;
            setTouchStart(startCoordX);
        } else {
            setTouchStart(null);
        }
    };
    const handleTouchEnd = (e: any): void => {
        const endCoordX = e.changedTouches[0].screenX;
        setTouchEnd(endCoordX);
    };

    const getCenter = (extent: any): any[] => {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    };

    const setCenter = (): void => {
        let tempPages = pages;
        tempPages[currentPage].map.getView().setCenter(getCenter(tempPages[currentPage].imageExtent));
        tempPages[currentPage].map.getView().setZoom(0);
        dispatch(setPages(tempPages));
    };

    const nextPage = (): void => {
        const numPages = pages.length;

        if (currentPage < numPages - 1) {
            const nextPage = currentPage + 1;
            const tempPages = pages;

            tempPages[currentPage].map.setTarget(null);
            pages[currentPage].map.setTarget(null);

            tempPages[nextPage].map.setTarget(ref.current);
            tempPages[nextPage].map.getView().setCenter(getCenter(tempPages[nextPage].imageExtent));
            tempPages[nextPage].map.getView().setZoom(0);

            batch(() => {
                dispatch(setPages(tempPages));
                dispatch(setCurrentPage(nextPage));
            });
        }
    };
    const previousPage = (): void => {
        if (currentPage !== 0) {
            const previousPage = currentPage - 1;
            const tempPages = pages;
            tempPages[currentPage].map.setTarget(null);
            pages[currentPage].map.setTarget(null);

            tempPages[previousPage].map.setTarget(ref.current);
            tempPages[previousPage].map.getView().setCenter(getCenter(tempPages[previousPage].imageExtent));
            tempPages[previousPage].map.getView().setZoom(0);

            batch(() => {
                dispatch(setPages(tempPages));
                dispatch(setCurrentPage(previousPage));
            });
        }
    };

    interface MapData {
        map: any;
        imageExtent: number[];
    }

    const createMapFromPDF = (url: string): Promise<MapData> => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Image = require('ol/layer/Image').default;
        const ImageStatic = require('ol/source/ImageStatic').default;
        const Projection = require('ol/proj/Projection').default;
        const PDFJS: any = require('pdfjs-dist');
        const pdfjsWorker: any = require('pdfjs-dist/build/pdf.worker.entry');

        PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

        const renderPage = (page: any): any => {
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            return page.render(renderContext).promise.then(() => {
                const imageWidth = canvas.width;
                const imageHeight = canvas.height;

                const imageExtent = [0, 0, imageWidth, imageHeight];

                const projection = new Projection({
                    units: 'pixels',
                    extent: imageExtent,
                });

                const source = new ImageStatic({
                    imageLoadFunction: (image: any): void => {
                        image.getImage().src = canvas.toDataURL();
                    },
                    projection: projection,
                    imageExtent: imageExtent,
                    crossOrigin: 'anonymous',
                });

                const map = new Map({
                    layers: [
                        new Image({
                            source: source,
                        }),
                    ],

                    view: new View({
                        projection: projection,
                        zoom: 0,
                        maxZoom: 4,
                        constrainResolution: false,
                        showFullExtent: true,
                        extent: imageExtent,
                        enableRotation: false,
                    }),
                    controls: [],
                });

                let target = null;
                if (page.pageIndex === 0) {
                    target = ref.current;
                }
                map.setTarget(target);

                const mapData = { map: map, imageExtent: imageExtent };

                return mapData;
            });
        };
        const renderPages = (pdfDoc: any): Promise<any> => {
            const promises: any[] = [];

            for (let num = 1; num <= pdfDoc.numPages; num++) {
                promises.push(pdfDoc.getPage(num).then(renderPage));
            }

            return Promise.all(promises);
        };

        return PDFJS.getDocument(url).promise.then((pages: any) => {
            const promises = renderPages(pages);
            return promises;
        });
    };

    useEffect(() => {
        if (!!pages[currentPage] && !!pages[currentPage].map) {
            const zoomLevel = pages[currentPage].map.getView().getZoom();
            console.log('ZOOMLEVEL: ' + zoomLevel + ' INITIAL: ' + initialZoom);

            if (initialZoom >= zoomLevel && !!touchStart) {
                if (touchEnd < touchStart - 50) {
                    console.log('Swiped left');
                    nextPage();
                } else if (touchEnd > touchStart + 50) {
                    console.log('Swiped right');
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

    useEffect(() => {
        if (pages.length === 0) {
            const maps: any[] = [];
            if (!!file) {
                const url = file;

                const pdfMaps = createMapFromPDF(url);
                maps.push(pdfMaps);

                Promise.all(maps).then((maps: any) => {
                    const flatMaps = maps.flat();

                    flatMaps[0].map.getView().setCenter(getCenter(flatMaps[0].imageExtent));
                    flatMaps[0].map.getView().setZoom(0);

                    const zoomLevel = flatMaps[0].map.getView().getZoom();
                    setInitialZoom(zoomLevel);

                    dispatch(setPages(flatMaps));

                    console.log('Valmiit sivut: ', flatMaps);
                });
            }
        } else {
            const tempPages = pages;

            tempPages[currentPage].map.setTarget(null);
            tempPages[currentPage].map.setTarget(ref.current);

            tempPages[currentPage].map.getView().setCenter(getCenter(tempPages[currentPage].imageExtent));
            tempPages[currentPage].map.getView().setZoom(0);

            dispatch(setPages(tempPages));
        }
    }, []);

    const renderLoading = pages.length === 0 && (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
            <CircularProgress color="primary" size={100} />
        </Box>
    );

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flex: '1 1 auto',
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgb(72, 76, 79,0.7)',
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'auto',
                }}
                ref={ref}
            >
                {renderLoading}
            </div>
        </div>
    );
};
