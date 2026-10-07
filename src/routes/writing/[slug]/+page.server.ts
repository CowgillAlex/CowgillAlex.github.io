import { error } from '@sveltejs/kit';
import { posts } from '#lib/server/writing.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

// No routes exist until a post is published; entries still prerender every public post.
export const prerender = 'auto';
export const entries: EntryGenerator = () => posts.map(post => ({ slug: post.slug }));
export const load: PageServerLoad = ({ params }) => {
	const post = posts.find(post => post.slug === params.slug);
	if (!post) error(404, { message: 'Post not found' });
	return { post };
};
