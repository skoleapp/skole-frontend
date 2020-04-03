import 'ol/ol.css';

import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NEXT_PAGE, PREV_PAGE, SET_CENTER, setCurrentPage, setPages, resetEffect } from '../../actions';
import { State } from '../../types';

/* eslint-disable */
interface Props {
    file: string;
}

export const PDFViewer: React.FC<Props> = ({ file }) => {
    const [touchStart, setTouchStart]: any = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [initialZoom, setInitialZoom] = useState(0);

    const [currentMap, setCurrentMap]: any = useState(null);

    const dispatch = useDispatch();

    const { pages, currentPage, effect } = useSelector((state: State) => state.resource);

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
        console.log(pages[currentPage].imageExtent);
        console.log(currentMap);
        currentMap.getView().setCenter(getCenter(pages[currentPage].imageExtent));
        currentMap.getView().setZoom(0);
    };

    const nextPage = (): void => {
        const numPages = pages.length;

        if (currentPage < numPages - 1) {
            const nextPage = currentPage + 1;
            currentMap.setLayerGroup(pages[nextPage].layer);
            dispatch(setCurrentPage(nextPage));
        }
    };
    const previousPage = (): void => {
        if (currentPage !== 0) {
            const previousPage = currentPage - 1;
            currentMap.setLayerGroup(pages[previousPage].layer);
            dispatch(setCurrentPage(previousPage));
        }
    };

    interface MapData {
        layer: any;
        imageExtent: number[];
    }

    const createPagesFromPDF = (url: string): Promise<MapData> => {
        const Image = require('ol/layer/Image').default;
        const ImageStatic = require('ol/source/ImageStatic').default;
        const Projection = require('ol/proj/Projection').default;
        const PDFJS: any = require('pdfjs-dist');
        const pdfjsWorker: any = require('pdfjs-dist/build/pdf.worker.entry');
        const Group = require('ol/layer/Group').default;

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

                const layer = new Group({
                    layers: [
                        new Image({
                            source: source,
                        }),
                    ],
                });

                if (page.pageIndex === 0) {
                    //
                }

                const mapData = { layer: layer, imageExtent: imageExtent };

                return mapData;
            });
        };
        const renderPages = (pages: any): Promise<any> => {
            const promises: any[] = [];

            for (let num = 1; num <= pages.numPages; num++) {
                promises.push(pages.getPage(num).then(renderPage));
            }

            return Promise.all(promises);
        };

        return PDFJS.getDocument(url).promise.then((pages: any) => {
            const promises = renderPages(pages);
            return promises;
        });
    };

    useEffect(() => {
        if (!!currentMap) {
            const zoomLevel = currentMap.getView().getZoom();
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

    const createMap = (imageExtent: number[]): any => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Projection = require('ol/proj/Projection').default;

        const projection = new Projection({
            units: 'pixels',
            extent: imageExtent,
        });

        const map = new Map({
            view: new View({
                projection: projection,
                zoom: 0,
                maxZoom: 4,
                constrainResolution: false,
                showFullExtent: true,
                enableRotation: false,
                extent: imageExtent,
            }),
            controls: [],
        });
        return map;
    };

    useEffect(() => {
        if (pages.length === 0) {
            const maps: any[] = [];
            if (!!file) {
                const url = file;

                const pdfMaps = createPagesFromPDF(url);
                maps.push(pdfMaps);

                Promise.all(maps).then((maps: any) => {
                    const flatMaps = maps.flat();

                    const imageExtent = flatMaps[0].imageExtent;
                    const layer = flatMaps[0].layer;

                    const map = createMap(imageExtent);

                    map.setLayerGroup(layer);
                    map.setTarget(ref.current);
                    map.getView().setCenter(getCenter(flatMaps[0].imageExtent));
                    map.getView().setZoom(0); //?

                    const zoomLevel = map.getView().getZoom();
                    setInitialZoom(zoomLevel);

                    setCurrentMap(map);
                    dispatch(setPages(flatMaps));

                    console.log('Valmiit sivut: ', flatMaps);
                });
            }
        } else {
            const imageExtent = pages[0].imageExtent;
            const layer = pages[0].layer;
            const map = createMap(imageExtent);
            map.setLayerGroup(layer);
            map.setTarget(ref.current);
            map.getView().setCenter(getCenter(imageExtent));
            map.getView().setZoom(0); //?

            const zoomLevel = map.getView().getZoom();
            setInitialZoom(zoomLevel);

            setCurrentMap(map);
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
