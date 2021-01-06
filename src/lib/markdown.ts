import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

// Load markdown from `markdown` folder and convert it to HTML to be used in SSG pages.
export const loadMarkdown = async (name: string): Promise<string> => {
  const markdownDir = join(process.cwd(), 'markdown');
  const fullPath = join(markdownDir, `${name}.md`);
  const fileContents = readFileSync(fullPath, 'utf8');
  return matter(fileContents).content;
};
