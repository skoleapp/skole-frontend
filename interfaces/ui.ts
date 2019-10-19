import { User } from './store';

export interface WidgetOpenProps {
  open: boolean;
}

interface Href {
  pathname: string;
  query?: {
    schoolType: string;
  };
}

export interface ShortcutProps {
  text: string;
  iconName: string;
  href: Href;
}

export type Variant = 'white' | 'red' | undefined;

export interface VariantProps {
  variant?: Variant;
}

export interface IconProps {
  iconName: string;
  onClick?: () => void;
}

export interface UserInfo {
  title?: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  points: number | null;
  language: string | null;
}

export interface UserPageInitialProps {
  user?: User;
}
