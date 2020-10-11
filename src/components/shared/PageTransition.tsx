import { Router } from 'next/router';
import React, { useState } from 'react';

import { LoadingLayout } from '../templates';

export const PageTransition: React.FC = ({ children }) => {
    const [loading, setLoading] = useState(false);
    Router.events.on('routeChangeStart', () => setLoading(true));
    Router.events.on('routeChangeComplete', () => setLoading(false));
    Router.events.on('routeChangeError', () => setLoading(false)); // Each page has their own error handling so we only disable the loading screen.
    return loading ? <LoadingLayout /> : <>{children}</>;
};
