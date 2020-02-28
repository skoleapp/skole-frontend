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
    const [currentMap, setCurrentMap]: any = useState({ map: null, imageExtent: [] });
    const [pages, setPages]: any = useState([]);
    const [currentPage, setCurrentPage]: any = useState(0);

    console.log(resource.resourceFiles);
    const url = mediaURL(resource.resourceFiles[1].file);

    console.time('renderTime');

    useEffect(() => {
        if (url.endsWith('.pdf')) {
            createMapFromPDF(url);

            console.timeEnd('renderTime');
        } else {
            getImageSize(url).then((imageSize: any) => {
                console.log('imageSize: ', imageSize);
                createMapFromImage(url, imageSize);
            });
        }
        return () => {
            setCurrentMap(null);
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

    const createMapFromImage = (url: string, imageSize: any) => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Image = require('ol/layer/Image').default;
        const Projection = require('ol/proj/Projection').default;
        const ImageStatic = require('ol/source/ImageStatic').default;

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

        const map = new Map({
            layers: [
                new Image({
                    source: source,
                }),
            ],
            target: 'map',
            view: new View({
                projection: projection,
                center: getCenter(imageExtent),
                zoom: 1,
            }),
            controls: [],
        });

        setCurrentMap(map);
    };

    const createMapFromPDF = (url: string) => {
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

            console.log('moro', page.pageIndex);

            page.render(renderContext).promise.then(() => {
                const imageWidth = canvas.width;
                const imageHeight = canvas.height;

                const imageExtent = [0, 0, imageWidth, imageHeight];

                console.log('PDF imageSize: ' + imageExtent);
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

                const mapData = { map: map, imageExtent: imageExtent };

                if (page.pageIndex === 0) {
                    map.setTarget('map');
                    setCurrentMap(mapData);
                }
                setPages((oldArray: any) => [...oldArray, mapData]);
            });
        };
        const renderPages = (pdfDoc: any) => {
            for (var num = 1; num <= pdfDoc.numPages; num++) pdfDoc.getPage(num).then(renderPage);
        };
        PDFJS.getDocument(url).then(renderPages);
    };

    const getCenter = (extent: any) => {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    };

    const setCenter = () => {
        console.log(currentMap);
        currentMap.map.getView().setCenter(getCenter(currentMap.imageExtent));
        currentMap.map.getView().setZoom(0);
    };

    const nextPage = () => {
        console.log('pages:', pages);
        console.log(currentMap);
        const numPages = pages.length;

        if (currentPage < numPages - 1) {
            console.log('ööö', currentPage, numPages);
            let nextPage = currentPage + 1;
            currentMap.map.setTarget(null);
            pages[nextPage].map.setTarget('map');
            setCurrentMap(pages[nextPage]);
            setCurrentPage(nextPage);
        }
    };
    const previousPage = () => {
        console.log('pages:', pages);
        console.log(currentMap);

        if (currentPage !== 0) {
            let previousPage = currentPage - 1;
            currentMap.map.setTarget(null);
            pages[previousPage].map.setTarget('map');
            setCurrentMap(pages[previousPage]);
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
