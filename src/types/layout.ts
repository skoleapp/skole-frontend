import { ContainerProps, GridProps } from '@material-ui/core';
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
    headerRight?: JSX.Element | false;
    headerRightSecondary?: JSX.Element | false;
    headerLeft?: JSX.Element | false;
}

interface CustomContainerProps extends Omit<ContainerProps, 'children'> {
    fullWidth?: boolean; // Custom props for stretching container to full screen width for landing pages etc.
    dense?: boolean; // Disable paddings.
}

export interface MainLayoutProps extends GridProps {
    children: NonNullable<ReactNode>;
    seoProps: SEOProps;
    topNavbarProps?: TopNavbarProps;
    containerProps?: CustomContainerProps;
    customTopNavbar?: JSX.Element;
    customBottomNavbar?: JSX.Element;
    disableBottomNavbar?: boolean;
    disableFooter?: boolean;
}
