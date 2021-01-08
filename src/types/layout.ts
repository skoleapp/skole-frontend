import { ContainerProps, GridProps } from '@material-ui/core';
import { ReactNode } from 'react';
import { UrlObject } from 'url';

export interface SeoProps {
  title?: string;
  description?: string;
}

export interface TopNavbarProps {
  header?: string; // Header text shown on mobile.
  dynamicBackUrl?: boolean; // Show a back button on mobile that automatically redirects to the last page.
  staticBackUrl?: string | UrlObject; // Show a back button and use this as the href.
  hideLogo?: boolean; // Hide the logo.
  hideSearch?: boolean; // Hide search field on desktop.
  hideAuthButtons?: boolean; // Hide auth buttons on desktop.
  hideForEducatorsButton?: boolean; // Hide the `For Educators` button on desktop.
  hideLanguageButton?: boolean; // Hide the language button on desktop.
  headerRight?: JSX.Element | false; // Custom element for right-most slot on mobile.
  headerRightSecondary?: JSX.Element | false; // Custom element for second slot from the right on mobile.
  headerLeft?: JSX.Element | false; // Custom element for either left-most slot or for second slot from the left, depending on whether the back button is rendered.
}

interface CustomContainerProps extends Omit<ContainerProps, 'children'> {
  fullWidth?: boolean; // Custom props for stretching container to full screen width for landing pages etc.
  dense?: boolean; // Hide paddings.
}

export interface MainTemplateProps extends GridProps {
  children: NonNullable<ReactNode>;
  seoProps: SeoProps;
  topNavbarProps?: TopNavbarProps;
  containerProps?: CustomContainerProps;
  customTopNavbar?: JSX.Element; // Custom element for top navbar.
  customBottomNavbar?: JSX.Element | false; // Custom element for bottom navbar.
  hideBottomNavbar?: boolean; // Hide bottom navbar.
  hideFooter?: boolean; // Hide footer.
}
