import { parse } from 'yaml';
import { marked } from 'marked';

export type Post = {
	slug: string;
	title: string;
	description: string;
	date: string;
	html: string;
};

const sources = import.meta.glob('/src/content/writing/*.md', {
	query: '?raw', import: 'default', eager: true
}) as Record<string, string>;

export const posts: Post[] = Object.entries(sources).flatMap(([path, source]) => {
	const slug = path.split('/').at(-1)!.replace(/\.md$/, '');
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid post filename: ' + path);
	const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
	if (!frontmatter) throw new Error('Missing frontmatter in ' + path);
	const metadata = parse(frontmatter[1]);
	if (!metadata || typeof metadata !== 'object') throw new Error('Invalid frontmatter in ' + path);
	if (metadata.draft !== undefined && typeof metadata.draft !== 'boolean') throw new Error('draft must be true or false in ' + path);
	if (metadata.draft === true) return [];
	for (const key of ['title', 'description', 'date']) {
		if (typeof metadata[key] !== 'string' || !metadata[key].trim()) throw new Error('Missing ' + key + ' in ' + path);
	}
	const date = new Date(metadata.date);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== metadata.date) {
		throw new Error('Use a valid YYYY-MM-DD date in ' + path);
	}
	return [{
		slug, title: metadata.title, description: metadata.description, date: metadata.date,
		// Only repository-authored Markdown is rendered. Drafts never enter the client bundle.
		html: marked.parse(source.slice(frontmatter[0].length), { async: false })
	}];
}).sort((a, b) => b.date.localeCompare(a.date));
