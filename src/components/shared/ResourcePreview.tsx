import 'ol/ol.css';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FullscreenOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

interface Props {
    url: string;
}
// url, size, scale
export const ResourcePreview: React.FC<Props> = ({ url }) => {
    const [, setMap] = useState(null);
    const [size] = useState([0, 0, 595, 842]);

    // TODO: implement proper canvas
    // 595 x 842 72dpi
    // 794 x 1123 96dpi

    console.time('renderTime');

    useEffect(() => {
        /*         const urlPDF = '/images/tenttisample2.pdf';
        const urlJPG = '/images/skole-icon.svg'; */

        if (url.endsWith('.pdf')) {
            createMapFromPDF(url);

            console.timeEnd('renderTime');
            // 0.3s - 0.5s render with x6 CPU throttle!
        } else {
            getImageSize(url).then((imageSize: any) => {
                console.log('imageSize: ', imageSize);
                createMapFromImage(url, imageSize);
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

    const FullscreenButton = (
        <IconButton onClick={() => {}}>
            <FullscreenOutlined color="secondary" />
        </IconButton>
    );

    controls.push(PreviousButton);
    controls.push(NextButton);

    const StyledControls = styled.div`
        z-index: 999;
        right: 0;
        margin: 0.4rem;
        position: absolute;
        justify-content: space-between;
    `;

    return (
        <div style={{ height: '100%', position: 'relative' }}>
            <StyledControls>{FullscreenButton}</StyledControls>
            <div
                style={{
                    backgroundColor: 'rgb(72, 76, 79,0.7)',
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
