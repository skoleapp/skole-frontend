import remark from 'remark';
import html from 'remark-html';
import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export const loadMarkdown = async (name: string): Promise<string> => {
  const markdownDir = join(process.cwd(), 'markdown');
  const fullPath = join(markdownDir, `${name}.md`);
  const fileContents = readFileSync(fullPath, 'utf8');
  const { content: _content } = matter(fileContents);
  const content = await remark().use(html).process(_content);
  return content.toString();
};
