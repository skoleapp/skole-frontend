import { MarkdownPageData } from './markdown';

export interface MarkdownPageProps extends Record<string, unknown> {
  data: MarkdownPageData;
  content: string;
}
