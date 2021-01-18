export interface MarkdownPageData {
  title?: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  date?: string;
  minutesToRead?: string;
  slug?: string;
}
export interface MarkdownPageProps extends Record<string, unknown> {
  data: MarkdownPageData;
  content: string;
}
