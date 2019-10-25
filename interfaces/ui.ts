import { SvgIconComponent } from '@material-ui/icons';
import { User } from './store';

export interface WidgetOpenProps {
  open: boolean;
}

export type Variant = 'white' | 'red' | undefined;

export interface VariantProps {
  variant?: Variant;
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
  user: User | null;
}

export interface IconProps {
  icon: SvgIconComponent;
  onClick?: () => void;
}
