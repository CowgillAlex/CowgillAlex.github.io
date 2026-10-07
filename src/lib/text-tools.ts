export function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

export function generateMetaTags(fields: { title: string; description: string; keywords: string; author: string; url: string }): string {
	const { title, description, keywords, author, url } = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, escapeHtml(value)]));
	return [
		`<title>${title}</title>`,
		`<meta name="description" content="${description}">`,
		...(keywords ? [`<meta name="keywords" content="${keywords}">`] : []),
		...(author ? [`<meta name="author" content="${author}">`] : []),
		`<meta property="og:title" content="${title}">`,
		`<meta property="og:description" content="${description}">`,
		...(url ? [`<meta property="og:url" content="${url}">`] : []),
		'<meta property="og:type" content="website">',
		'<meta name="twitter:card" content="summary">',
		`<meta name="twitter:title" content="${title}">`,
		`<meta name="twitter:description" content="${description}">`
	].join('\n');
}

export function toSingleLine(text: string): string {
	return text.replace(/\r\n|[\r\n\u2028\u2029]/g, ' ');
}

export function generateUVCoordinates(atlasWidth: number, atlasHeight: number, x: number, y: number, width: number, height: number, comment = ''): string {
	if (![atlasWidth, atlasHeight, x, y, width, height].every(Number.isFinite) || atlasWidth <= 0 || atlasHeight <= 0 || width <= 0 || height <= 0 || x < 0 || y < 0) {
		throw new Error('Use positive dimensions and non-negative starting coordinates.');
	}
	if (x + width > atlasWidth || y + height > atlasHeight) throw new Error('The tile must fit inside the texture atlas.');
	const bottomLeft = [x / atlasWidth, y / atlasHeight];
	const topLeft = [x / atlasWidth, (y + height) / atlasHeight];
	const topRight = [(x + width) / atlasWidth, (y + height) / atlasHeight];
	const bottomRight = [(x + width) / atlasWidth, y / atlasHeight];
	return [
		...(comment.trim() ? ['// ' + toSingleLine(comment).toUpperCase()] : []),
		...[bottomLeft, topLeft, topRight, topRight, bottomRight, bottomLeft].map(([u, v]) => `new Vector2f(${u.toFixed(4)}f, ${v.toFixed(4)}f),`)
	].join('\n');
}
