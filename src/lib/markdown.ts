import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

// Load markdown content from files in `markdown` folder for statically generated pages.
export const loadMarkdown = async (name: string): Promise<string> => {
  const markdownDir = join(process.cwd(), 'markdown');
  const fullPath = join(markdownDir, `${name}.md`);
  const fileContents = readFileSync(fullPath, 'utf8');
  return matter(fileContents).content;
};
