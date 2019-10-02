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
