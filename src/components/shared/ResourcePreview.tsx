import 'ol/ol.css';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { NavigateNextOutlined, NavigateBeforeOutlined, FullscreenOutlined } from '@material-ui/icons';
import { IconButton, CircularProgress, Box } from '@material-ui/core';
import { mediaURL } from '../../utils';
interface Props {
    resource: any;
    pages: any[];
    setPages: (foo: any[]) => void;
    currentPage: number;
    setCurrentPage: (index: number) => void;
}
// url, size, scale
export const ResourcePreview: React.FC<Props> = ({ resource, pages, setPages, currentPage, setCurrentPage }) => {
    console.log('currentPage: ', currentPage);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (pages.length === 0) {
            let maps: any[] = [];
            if (!!resource && !!resource.resourceFiles) {
                resource.resourceFiles.forEach((resource: any, i: number) => {
                    console.log('!!', resource);
                    const url = mediaURL(resource.file);

                    if (url.endsWith('.pdf')) {
                        const doo = createMapFromPDF(url, i);
                        maps[i] = doo;
                    } else {
                        const foo = createMapFromImage(url, i);
                        maps[i] = foo;
                    }
                });
                Promise.all(maps).then((madd: any) => {
                    const foo = madd.flat();

                    foo[0].map.getView().setCenter(getCenter(foo[0].imageExtent));
                    foo[0].map.getView().setZoom(0);

                    setPages(foo);
                    console.log('Valmiit sivut: ', foo);
                });
            }
        } else {
            console.log('welcome back!');
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

    const createMapFromImage = (url: string, i: number) => {
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

            let target = 'null';
            if (i === 0) {
                target = 'map';
            }

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

    const createMapFromPDF = (url: string, i: number) => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Image = require('ol/layer/Image').default;
        const Projection = require('ol/proj/Projection').default;
        const ImageStatic = require('ol/source/ImageStatic').default;
        const PDFJS: any = require('pdfjs-dist');

        const renderPage = (page: any) => {
            const viewport = page.getViewport({ scale: 1.5 });
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

                //console.log('PDF imageSize: ' + imageExtent);
                //const elementExtent = [0, 0, size[2], size[3];

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

                // First page
                if (page.pageIndex === 0 && i === 0) {
                    map.setTarget('map');
                }
                const mapData = { map: map, imageExtent: imageExtent };

                return mapData;
            });
        };
        const renderPages = (pdfDoc: any) => {
            let promises: any[] = [];

            for (var num = 1; num <= pdfDoc.numPages; num++) {
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

    const getCenter = (extent: any) => {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    };

    const setCenter = () => {
        pages[currentPage].map.getView().setCenter(getCenter(pages[currentPage].imageExtent));
        pages[currentPage].map.getView().setZoom(0);
    };

    const nextPage = () => {
        console.log('pages:', pages);
        console.log('current page map: ', pages[currentPage]);

        const numPages = pages.length;

        if (currentPage < numPages - 1) {
            const nextPage = currentPage + 1;
            const tempPages = pages;
            setPages([]);
            tempPages[currentPage].map.setTarget(null);

            tempPages[nextPage].map.setTarget('map');
            tempPages[nextPage].map.getView().setCenter(getCenter(tempPages[nextPage].imageExtent));
            tempPages[nextPage].map.getView().setZoom(0);

            setPages(tempPages);
            setCurrentPage(nextPage);
        }
    };
    const previousPage = () => {
        console.log('pages:', pages);
        console.log('current page map: ', pages[currentPage]);

        if (currentPage !== 0) {
            const previousPage = currentPage - 1;
            const tempPages = pages;
            setPages([]);
            tempPages[currentPage].map.setTarget(null);

            tempPages[previousPage].map.setTarget('map');
            tempPages[previousPage].map.getView().setCenter(getCenter(tempPages[previousPage].imageExtent));
            tempPages[previousPage].map.getView().setZoom(0);

            setPages(tempPages);
            setCurrentPage(previousPage);
        }
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
    const StyledLayer = styled.div`
        z-index: 999;
        display: flex;
        position: absolute;
        margin: 0.5rem;
        padding: 0.5rem 0.7rem;
        color: white;
        background-color: rgb(72, 76, 79, 0.7);
    `;

    const NextPageButton = (
        <IconButton
            disabled={currentPage === pages.length - 1}
            onClick={() => {
                nextPage();
            }}
        >
            <NavigateNextOutlined color="primary" />
        </IconButton>
    );
    const PreviousPageButton = (
        <IconButton
            disabled={currentPage === 0}
            onClick={() => {
                previousPage();
            }}
        >
            <NavigateBeforeOutlined color="primary" />
        </IconButton>
    );
    const CenterImageButton = (
        <IconButton
            onClick={() => {
                setCenter();
            }}
        >
            <FullscreenOutlined color="primary" />
        </IconButton>
    );

    return (
        <>
            <div style={{ height: '100%', position: 'relative' }}>
                {pages.length > 0 && <StyledLayer>{currentPage + 1 + ' / ' + pages.length}</StyledLayer>}
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
                {pages.length === 0 && (
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                        <CircularProgress color="primary" size={100} />
                    </Box>
                )}
            </div>
            <StyledControls>
                {PreviousPageButton}
                {CenterImageButton}
                {NextPageButton}
            </StyledControls>
        </>
    );
};
