export type Heading = { id: string; text: string; level: number };

export function collectHeadings(content: HTMLElement): Heading[] {
	const usedIds = new Set(Array.from(document.querySelectorAll('[id]'), element => element.id));
	return Array.from(content.querySelectorAll<HTMLElement>('h2, h3')).map(heading => {
		const text = heading.textContent?.trim() || 'Section';
		if (!heading.id) {
			const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
			let id = base;
			let suffix = 2;
			while (usedIds.has(id)) id = `${base}-${suffix++}`;
			heading.id = id;
			usedIds.add(id);
		}
		heading.tabIndex = -1;
		return { id: heading.id, text, level: Number(heading.tagName.slice(1)) };
	});
}
