import { ContainerProps } from '@material-ui/core/Container';
import { GridProps } from '@material-ui/core/Grid';

export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
}

export interface TopNavbarProps {
  header?: JSX.Element | string | false; // Header shown on mobile.
  emoji?: string | false; // Emoji shown after the header on mobile.
  hideBackButton?: boolean; // Hide the back button on mobile.
  hideLogo?: boolean; // Hide the logo.
  hideSearch?: boolean; // Hide search field on desktop.
  hideDynamicButtons?: boolean; // Hide all dynamic buttons (Login, Register, Get Started, Activity, Starred, Rank, Profile) on desktop.
  hideDynamicAuthButtons?: boolean; // Hide all dynamic buttons for authenticated users (Activity, Starred, Rank, Profile) on desktop.
  hideLoginButton?: boolean; // Hide the `Login` button on desktop.
  hideRegisterButton?: boolean; // Hide the `Register` button on desktop.
  hideGetStartedButton?: boolean; // Hide the `Get Started` button on desktop.
  hideLanguageButton?: boolean; // Hide the language button on desktop.
  hideDarkModeButton?: boolean; // Hide dark mode button on desktop.
  renderHeaderLeft?: JSX.Element | false; // Custom element for either left-most slot or for second slot from the left, depending on whether the back button is rendered.
  renderHeaderRight?: JSX.Element | false; // Custom element for right-most slot on mobile.
  renderHeaderRightSecondary?: JSX.Element | false; // Custom element for second slot from the right on mobile.
}

interface CustomContainerProps extends Omit<ContainerProps, 'children'> {
  fullWidth?: boolean; // Custom props for stretching container to full screen width for landing pages etc.
  dense?: boolean; // Hide paddings.
}

export interface FooterProps {
  hideAppStoreBadges?: boolean; // Hide app store badges in footer.
}

export interface MainTemplateProps extends GridProps {
  children?: ContainerProps['children'];
  seoProps?: SeoProps;
  topNavbarProps?: TopNavbarProps;
  containerProps?: CustomContainerProps;
  customTopNavbar?: JSX.Element; // Custom element for top navbar.
  customBottomNavbar?: JSX.Element | false; // Custom element for bottom navbar.
  hideBottomNavbar?: boolean; // Hide bottom navbar.
  hideFooter?: boolean; // Hide footer.
  footerProps?: FooterProps;
}
