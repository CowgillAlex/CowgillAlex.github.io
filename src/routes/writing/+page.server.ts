import { posts } from '#lib/server/writing.ts';

export function load() {
	return { posts: posts.map(({ html, ...post }) => post) };
}
