import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { defaultLocale } from 'i18n.json';

// Load markdown content from files in `markdown` folder for statically generated pages.
export const loadMarkdownContent = async (
  name: string,
  lang: string = defaultLocale,
): Promise<string> => {
  const markdownDir = join(process.cwd(), 'markdown');
  const fullPath = join(markdownDir, lang, `${name}.md`);
  const fileContents = readFileSync(fullPath, 'utf8');
  return matter(fileContents).content;
};
