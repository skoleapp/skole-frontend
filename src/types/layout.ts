import { ReactNode } from 'react';
import { UrlObject } from 'url';

export interface SEOProps {
    title?: string;
    description?: string;
}

export interface TopNavbarProps {
    header?: string;
    dynamicBackUrl?: boolean;
    staticBackUrl?: {
        href: string | UrlObject;
        as?: string | UrlObject;
    };
    disableSearch?: boolean;
    disableAuthButtons?: boolean;
    disableLogo?: boolean;
    headerRight?: JSX.Element | boolean;
    headerRightSecondary?: JSX.Element;
    headerLeft?: JSX.Element;
}

export interface MainLayoutProps {
    children: NonNullable<ReactNode>;
    seoProps: SEOProps;
    topNavbarProps?: TopNavbarProps;
    customTopNavbar?: JSX.Element;
    customBottomNavbar?: JSX.Element;
    disableBottomNavbar?: boolean;
}
