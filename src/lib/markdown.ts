import { readFileSync } from 'fs';
import matter from 'gray-matter';
import { defaultLocale } from 'i18n';
import { join } from 'path';
import { MarkdownPageProps } from 'types';

export const loadMarkdown = async (
  name: string,
  lang: string = defaultLocale,
): Promise<Pick<MarkdownPageProps, 'data' | 'content'>> => {
  const markdownDir = join(process.cwd(), 'markdown');
  const fullPath = join(markdownDir, lang, `${name}.md`);
  const fileContents = readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    data,
    content,
  };
};
