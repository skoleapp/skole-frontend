import 'ol/ol.css';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// url, size, scale
export const ResourcePreview = () => {
    const [, setMap] = useState(null);
    const [size, setSize] = useState([0, 0, 595, 842]);

    // TODO: implement proper canvas
    // 595 x 842 72dpi
    // 794 x 1123 96dpi

    console.time('renderTime');

    useEffect(() => {
        const urlPDF = '/images/tenttisample2.pdf';
        const urlJPG = '/images/skole-icon.svg';

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            setSize([0, 0, window.innerWidth - 30, window.innerHeight - 130]);
        }

        if (urlPDF.endsWith('.pdf')) {
            createMapFromPDF(urlPDF);

            console.timeEnd('renderTime');
            // 0.3s - 0.5s render with x6 CPU throttle!
        } else {
            getImageSize(urlJPG).then((imageSize: any) => {
                console.log('imageSize: ', imageSize);
                createMapFromImage(urlJPG, imageSize);
            });
        }
        return () => {
            setMap(null);
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
        const PinchZoom = require('ol/interaction').PinchZoom;
        const defaults = require('ol/interaction').defaults;

        const elementExtent = [0, 0, size[2], size[3]];
        const imageExtent = [0, 0, imageSize[0], imageSize[1]];

        const projection = new Projection({
            units: 'pixels',
            extent: elementExtent,
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
                resolution: 1,
                maxResolution: 1,
                constrainResolution: true,
            }),
            interactions: defaults().extend([new PinchZoom()]),
        });

        setMap(map);
    };

    const createMapFromPDF = (url: string) => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Image = require('ol/layer/Image').default;
        const Projection = require('ol/proj/Projection').default;
        const ImageStatic = require('ol/source/ImageStatic').default;
        const PDFJS: any = require('pdfjs-dist');

        PDFJS.getDocument(url).promise.then((pdf: any) => {
            const numberOfPages = pdf.numPages;
            console.log('Number of PDF pages: ' + numberOfPages);
            pdf.getPage(1).then((page: any) => {
                const scale = 1.5;
                const viewport = page.getViewport({ scale: scale });
                const canvas: any = document.createElement('canvas');

                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const imageWidth = canvas.width;
                const imageHeight = canvas.height;

                let theURL = '';
                page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                    theURL = canvas.toDataURL();

                    const imageExtent = [0, 0, imageWidth, imageHeight];

                    console.log('PDF imageSize: ' + imageExtent);
                    //const elementExtent = [0, 0, size[2], size[3];

                    const projection = new Projection({
                        units: 'pixels',
                        extent: imageExtent,
                    });

                    const source = new ImageStatic({
                        imageLoadFunction: (image: any) => {
                            image.getImage().src = theURL;
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
                        target: 'map',
                        view: new View({
                            projection: projection,
                            center: getCenter(imageExtent),
                            resolution: 2,
                            maxResolution: 2,
                            zoom: 0,
                            maxZoom: 4,
                            constrainResolution: false,
                        }),
                    });

                    setMap(map);
                });
            });
        });
    };

    const getCenter = (extent: any) => {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    };

    let controls: any = [];

    const StyledButton = styled.button`
        background-color: #438eb9;
        z-index: 9999;
        margin: 3px;
        color: #fff;
        font-weight: 700;
        text-align: center;
        height: 40px;
        width: 30px;
        border: none;
        border-radius: 2;
        outline: none;
    `;
    const PreviousButton = (
        <StyledButton key={2} onClick={() => {}}>
            {'<'}
        </StyledButton>
    );
    const NextButton = (
        <StyledButton key={1} onClick={() => {}}>
            {'>'}
        </StyledButton>
    );

    controls.push(PreviousButton);
    controls.push(NextButton);

    const StyledControls = styled(({ size, ...other }) => <div {...other} />)`
        width: ${({ size }): any => size[2] + 'px'};
        position: absolute;
        display: none;
        justify-content: space-between;
    `;

    return (
        <div>
            <StyledControls size={size}>{controls}</StyledControls>
            <div
                style={{
                    backgroundColor: '#484C4F',
                    border: '1px solid black',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                }}
                id="map"
                className="map"
            ></div>
        </div>
    );
};
