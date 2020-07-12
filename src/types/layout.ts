import { ContainerProps } from '@material-ui/core';
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
    headerRight?: JSX.Element | boolean;
    headerRightSecondary?: JSX.Element;
    headerLeft?: JSX.Element;
}

export interface LayoutProps {
    seoProps?: SEOProps;
    topNavbarProps?: TopNavbarProps;
    containerProps?: ContainerProps;
    customTopNavbar?: JSX.Element;
    customBottomNavbar?: JSX.Element;
}
