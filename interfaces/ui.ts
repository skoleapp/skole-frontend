export interface MenuOpenProps {
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
