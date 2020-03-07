import 'ol/ol.css';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
    NavigateNextOutlined,
    NavigateBeforeOutlined,
    FullscreenOutlined,
    KeyboardArrowUpOutlined,
    KeyboardArrowDownOutlined,
} from '@material-ui/icons';
import { IconButton, CircularProgress, Box, Typography } from '@material-ui/core';

interface Props {
    file: string;
    pages: any[];
    setPages: (pages: any[]) => void;
    currentPage: number;
    setCurrentPage: (index: number) => void;
    voteProps: any;
}
export const ResourcePreview: React.FC<Props> = ({ file, pages, setPages, currentPage, setCurrentPage, voteProps }) => {
    const [touchStart, setTouchStart]: any = useState(0);
    const [touchEnd, setTouchEnd]: any = useState(0);

    const { vote, voteSubmitting, handleVote, points } = voteProps;

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!!pages[currentPage] && !!pages[currentPage].map) {
            const zoomLevel = pages[currentPage].map.getView().getZoom();
            console.log('ZOOMLEVEL: ' + zoomLevel);

            if (zoomLevel < 1.3) {
                if (touchEnd < touchStart - 300) {
                    console.log('Swiped left');
                    nextPage();
                } else if (touchEnd > touchStart + 300) {
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

        return () => {
            if (!!ref.current) {
                ref.current.removeEventListener('touchstart', handleTouchStart, false);
                ref.current.removeEventListener('touchend', handleTouchEnd, false);
            }
        };
    }, [ref.current]);

    useEffect(() => {
        if (pages.length === 0) {
            let maps: any[] = [];
            if (!!file) {
                const url = file;

                if (url.endsWith('.pdf')) {
                    const pdfMaps = createMapFromPDF(url);
                    maps.push(pdfMaps);
                } else {
                    const imageMaps = createMapFromImage(url);
                    maps.push(imageMaps);
                }

                Promise.all(maps).then((maps: any) => {
                    const flatMaps = maps.flat();

                    flatMaps[0].map.getView().setCenter(getCenter(flatMaps[0].imageExtent));
                    flatMaps[0].map.getView().setZoom(0);

                    setPages(flatMaps);
                    console.log('Valmiit sivut: ', flatMaps);
                });
            }
        } else {
            const tempPages = pages;

            setPages([]);

            tempPages[currentPage].map.setTarget(null);
            tempPages[currentPage].map.setTarget('map');

            tempPages[currentPage].map.getView().setCenter(getCenter(tempPages[currentPage].imageExtent));
            tempPages[currentPage].map.getView().setZoom(0);

            setPages(tempPages);
        }
    }, []);

    const getImageSize = (url: string) => {
        return new Promise(resolve => {
            let img = new Image();
            img.src = url;
            img.onload = () => {
                resolve([img.width, img.height]);
            };
        });
    };

    const createMapFromImage = (url: string) => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Image = require('ol/layer/Image').default;
        const Projection = require('ol/proj/Projection').default;
        const ImageStatic = require('ol/source/ImageStatic').default;

        return getImageSize(url).then((imageSize: any) => {
            const imageExtent = [0, 0, imageSize[0], imageSize[1]];

            const projection = new Projection({
                units: 'pixels',
                extent: imageExtent,
            });

            const source = new ImageStatic({
                url: url,
                projection: projection,
                imageExtent: imageExtent,
                crossOrigin: 'anonymous',
            });

            let target = 'map';

            const map = new Map({
                layers: [
                    new Image({
                        source: source,
                    }),
                ],
                target: target,
                view: new View({
                    projection: projection,
                    center: getCenter(imageExtent),
                    extent: imageExtent,
                    showFullExtent: true,
                    zoom: 0,
                    maxZoom: 4,
                    constrainResolution: false,
                }),
                controls: [],
            });

            const mapData = { map: map, imageExtent: imageExtent };

            return mapData;
        });
    };

    const createMapFromPDF = (url: string) => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Image = require('ol/layer/Image').default;
        const ImageStatic = require('ol/source/ImageStatic').default;
        const Projection = require('ol/proj/Projection').default;
        const PDFJS: any = require('pdfjs-dist');
        const pdfjsWorker: any = require('pdfjs-dist/build/pdf.worker.entry');

        PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

        const renderPage = (page: any) => {
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
                    imageLoadFunction: (image: any) => {
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
                        center: getCenter(imageExtent),
                        zoom: 0,
                        maxZoom: 4,
                        constrainResolution: false,
                        showFullExtent: true,
                        extent: imageExtent,
                    }),
                    controls: [],
                });

                let target = null;
                if (page.pageIndex === 0) {
                    target = 'map';
                }
                map.setTarget(target);

                const mapData = { map: map, imageExtent: imageExtent };

                return mapData;
            });
        };
        const renderPages = (pdfDoc: any) => {
            let promises: any[] = [];

            for (let num = 1; num <= pdfDoc.numPages; num++) {
                promises.push(pdfDoc.getPage(num).then(renderPage));
            }

            return Promise.all(promises);
        };

        PDFJS.disableWorker = true;
        return PDFJS.getDocument(url).promise.then((pages: any) => {
            const promises = renderPages(pages);
            return promises;
        });
    };

    const handleTouchStart = (e: any) => {
        const startCoordX = e.changedTouches[0].screenX;
        setTouchStart(startCoordX);
    };
    const handleTouchEnd = (e: any) => {
        const endCoordX = e.changedTouches[0].screenX;
        setTouchEnd(endCoordX);
    };

    const getCenter = (extent: any) => {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    };

    const setCenter = () => {
        pages[currentPage].map.getView().setCenter(getCenter(pages[currentPage].imageExtent));
        pages[currentPage].map.getView().setZoom(0);
    };

    const nextPage = () => {
        const numPages = pages.length;

        if (currentPage < numPages - 1) {
            const nextPage = currentPage + 1;
            const tempPages = pages;
            setPages([]);
            tempPages[currentPage].map.setTarget(null);
            pages[currentPage].map.setTarget(null);

            tempPages[nextPage].map.setTarget('map');
            tempPages[nextPage].map.getView().setCenter(getCenter(tempPages[nextPage].imageExtent));
            tempPages[nextPage].map.getView().setZoom(0);

            setPages(tempPages);
            setCurrentPage(nextPage);
        }
    };
    const previousPage = () => {
        if (currentPage !== 0) {
            const previousPage = currentPage - 1;
            const tempPages = pages;
            setPages([]);
            tempPages[currentPage].map.setTarget(null);
            pages[currentPage].map.setTarget(null);

            tempPages[previousPage].map.setTarget('map');
            tempPages[previousPage].map.getView().setCenter(getCenter(tempPages[previousPage].imageExtent));
            tempPages[previousPage].map.getView().setZoom(0);

            setPages(tempPages);
            setCurrentPage(previousPage);
        }
    };

    const renderCenterImageButton = (
        <IconButton
            onClick={() => {
                setCenter();
            }}
        >
            <FullscreenOutlined color="primary" />
        </IconButton>
    );

    const renderNavigationButtons = (
        <Box width="7rem" justifyContent="center" alignItems="center" display="flex">
            <IconButton disabled={currentPage === 0} onClick={previousPage} size="small">
                <NavigateBeforeOutlined color={currentPage === 0 ? 'disabled' : 'primary'} />
            </IconButton>
            <Typography style={{ margin: 10 }} variant="body2">
                {currentPage + 1 + ' / ' + pages.length}
            </Typography>
            <IconButton disabled={currentPage === pages.length - 1} onClick={nextPage} size="small">
                <NavigateNextOutlined color={currentPage === pages.length - 1 ? 'disabled' : 'primary'} />
            </IconButton>
        </Box>
    );

    const renderVoteButtons = (
        <Box width="7rem" justifyContent="center" alignItems="center" display="flex">
            <IconButton
                color={!!vote && vote.status === 1 ? 'primary' : 'inherit'}
                onClick={handleVote(1)}
                disabled={voteSubmitting}
                size="small"
            >
                <KeyboardArrowUpOutlined />
            </IconButton>
            <Typography style={{ margin: 10 }} variant="body2">
                {points}
            </Typography>
            <IconButton
                color={!!vote && vote.status === -1 ? 'primary' : 'inherit'}
                onClick={handleVote(-1)}
                disabled={voteSubmitting}
                size="small"
            >
                <KeyboardArrowDownOutlined />
            </IconButton>
        </Box>
    );

    const resourcesRendered = pages.length > 0;

    return (
        <>
            <div style={{ height: '100%', position: 'relative' }}>
                <div
                    style={{
                        backgroundColor: 'rgb(72, 76, 79,0.7)',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        overflowY: 'auto',
                        overflowX: 'auto',
                    }}
                    id="map"
                    ref={ref}
                    className="map"
                />
                {!resourcesRendered && (
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                        <CircularProgress color="primary" size={100} />
                    </Box>
                )}
            </div>
            <StyledControls>
                {renderNavigationButtons}
                {renderCenterImageButton}
                {renderVoteButtons}
            </StyledControls>
        </>
    );
};

const StyledControls = styled.div`
    z-index: 999;
    width: 100%;
    bottom: 0;
    display: flex;
    position: relative;
    justify-content: space-around;
    background-color: white;
`;
