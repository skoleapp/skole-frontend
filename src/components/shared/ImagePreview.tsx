import 'ol/ol.css';
import React, { useEffect, useState } from 'react';

export const ImagePreview = () => {
    const [, setMap] = useState(null);

    const getCenter = (extent: any) => {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    };

    useEffect(() => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const Image = require('ol/layer/Image').default;
        const Projection = require('ol/proj/Projection').default;
        const ImageStatic = require('ol/source/ImageStatic').default;
        const PinchZoom = require('ol/interaction').PinchZoom;
        const defaults = require('ol/interaction').defaults;
        const PDFJS: any = require('pdfjs-dist');

        var url = '/images/sample.pdf';
        PDFJS.disableWorker = true;

        //
        // Asynchronous download PDF as an ArrayBuffer
        //
        PDFJS.getDocument(url).promise.then((pdf: any) => {
            //
            // Fetch the first page
            //
            pdf.getPage(1).then((page: any) => {
                var scale = 2;
                var viewport = page.getViewport(scale);

                //
                // Prepare canvas using PDF page dimensions
                //
                var canvas: any = document.createElement('canvas');

                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                let theURL = '';

                //
                // Render PDF page into canvas context
                //
                page.render({ canvasContext: context, viewport: viewport }).then(() => {
                    theURL = canvas.toDataURL();

                    console.log('hey', theURL);

                    var extent = [0, 0, 1024, 968];
                    var projection = new Projection({
                        units: 'pixels',
                        extent: extent,
                    });

                    var map = new Map({
                        layers: [
                            new Image({
                                source: new ImageStatic({
                                    imageLoadFunction: (image: any) => {
                                        image.getImage().src = theURL;
                                    },
                                    projection: projection,
                                    imageExtent: extent,
                                }),
                            }),
                        ],
                        target: 'map',
                        view: new View({
                            projection: projection,
                            center: getCenter(extent),
                            zoom: 1,
                            maxZoom: 8,
                            constrainResolution: true,
                        }),
                        interactions: defaults().extend([new PinchZoom()]),
                    });

                    setMap(map);
                });
            });
        });
    }, []);

    return (
        <div>
            <div
                style={{ backgroundColor: 'grey', border: '1px solid black', width: '100%', height: '600px' }}
                id="map"
                className="map"
            ></div>
        </div>
    );
};
