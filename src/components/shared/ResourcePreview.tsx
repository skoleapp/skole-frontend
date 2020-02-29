import 'ol/ol.css';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NavigateNextOutlined, NavigateBeforeOutlined, FullscreenOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { mediaURL } from '../../utils';
interface Props {
    resource: any;
}
// url, size, scale
export const ResourcePreview: React.FC<Props> = ({ resource }) => {
    const [pages, setPages]: any[] = useState([]);
    const [currentPage, setCurrentPage]: any = useState(0);

    console.log('currentPage: ', currentPage);

    useEffect(() => {
        let maps: any[] = [];
        if (!!resource && !!resource.resourceFiles) {
            resource.resourceFiles.forEach((resource: any, i: number) => {
                console.log('!!', resource);
                const url = mediaURL(resource.file);

                if (url.endsWith('.pdf')) {
                    const doo = createMapFromPDF(url, i);
                    maps[i] = doo;
                    console.log('!!!pdfs', maps);
                } else {
                    const foo = createMapFromImage(url, i);
                    maps[i] = foo;
                    console.log('!!!', maps);
                    console.log('!!!', foo);
                }
            });
            console.log('nyt jo täällä');
            Promise.all(maps).then((madd: any) => {
                setPages(madd.flat());
                console.log('JOOOOOOOOOO');
                console.log(madd);
                console.log(madd.flat());
            });
        }
        return () => {
            setPages([]);
        };
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
            //const elementExtent = [0, 0, size[2], size[3]];

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
                    zoom: 1,
                }),
                controls: [],
            });
            const mapData = { map: map, imageExtent: imageExtent };

            return mapData;

            //setPages((oldArray: any) => [...oldArray, map]);
        });
    };

    const createMapFromPDF = (url: string, i: number) => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Image = require('ol/layer/Image').default;
        const Projection = require('ol/proj/Projection').default;
        const ImageStatic = require('ol/source/ImageStatic').default;
        const PDFJS: any = require('pdfjs-dist');

        PDFJS.disableWorker = true;

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

            return page
                .render(renderContext)
                .promise.then(() => {
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
                            resolution: 2,
                            maxResolution: 2,
                            zoom: 0,
                            maxZoom: 4,
                            constrainResolution: false,
                        }),
                        controls: [],
                    });

                    console.log('hey', i, page.pageIndex);
                    if (page.pageIndex === 0 && i === 0) {
                        console.log('täällä!');
                        map.setTarget('map');
                    }

                    const mapData = { map: map, imageExtent: imageExtent };
                    return mapData;
                    //setPages((oldArray: any) => [...oldArray, mapData]);
                })
                .then((mapData: any) => {
                    console.log('juu', mapData);
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

        return PDFJS.getDocument(url).promise.then((l: any) => {
            const hmm = renderPages(l);
            console.log('lel', hmm);
            return hmm;
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

        console.log(pages[currentPage]);

        const numPages = pages.length;

        if (currentPage < numPages - 1) {
            console.log('ööö', currentPage, numPages);

            let nextPage = currentPage + 1;
            const foo = pages;
            setPages(null);
            foo[currentPage].map.setTarget(null);
            foo[nextPage].map.setTarget('map');
            setPages(foo);
            setCurrentPage(nextPage);
        }
    };
    const previousPage = () => {
        console.log('pages:', pages);
        console.log(pages[currentPage]);

        if (currentPage !== 0) {
            let previousPage = currentPage - 1;
            const foo = pages;
            setPages(null);
            foo[currentPage].map.setTarget(null);
            foo[previousPage].map.setTarget('map');
            setPages(foo);
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
        .MuiIconButton-root {
        }
        background-color: white;
    `;

    const NextPageButton = (
        <IconButton
            onClick={() => {
                nextPage();
            }}
        >
            <NavigateNextOutlined color="primary" />
        </IconButton>
    );
    const PreviousPageButton = (
        <IconButton
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
                    className="map"
                />
            </div>
            <StyledControls>
                {PreviousPageButton}
                {CenterImageButton}
                {NextPageButton}
            </StyledControls>
        </>
    );
};
