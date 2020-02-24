import 'ol/ol.css';
import React, { useEffect, useState } from 'react';

export const ImagePreview = () => {
    const [, setMap] = useState(null);

    const getCenter = extent => {
        return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    };

    useEffect(() => {
        const Map = require('ol/Map').default;
        const View = require('ol/View').default;
        const ImageLayer = require('ol/layer/Image').default;
        const Projection = require('ol/proj/Projection').default;
        const Static = require('ol/source/ImageStatic').default;
        const PinchZoom = require('ol/interaction').PinchZoom;
        const defaults = require('ol/interaction').defaults;

        var extent = [0, 0, 1024, 968];
        var projection = new Projection({
            units: 'pixels',
            extent: extent,
        });

        var map = new Map({
            layers: [
                new ImageLayer({
                    source: new Static({
                        url: 'https://imgs.xkcd.com/comics/online_communities.png',
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
    }, []);

    return (
        <div>
            <div style={{ width: '500px', height: '500px' }} id="map" className="map"></div>
        </div>
    );
};
