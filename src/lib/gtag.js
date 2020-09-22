export const GA_TRACKING_ID = 'UA-159917631-1';

export const GAScript = {
    __html: `
        window.dataLayer = window.dataLayer || [];

        function gtag(){
            dataLayer.push(arguments);
        };

        gtag('js', new Date());

        gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
        });
    `,
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = url => {
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};
