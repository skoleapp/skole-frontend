import { SeoProps } from './layout';
import { MarkdownPageData } from './markdown';

export interface SeoPageProps extends Record<string, unknown> {
  seoProps: SeoProps;
}

export interface MarkdownPageProps extends SeoPageProps {
  data: MarkdownPageData;
  content: string;
}

export interface NativeAppPageProps extends SeoPageProps {
  nativeApp: boolean;
}
