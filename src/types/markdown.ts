interface MarkdownPageData {
  header?: string;
}
export interface MarkdownPageProps extends Record<string, unknown> {
  data: MarkdownPageData;
  content: string;
}
