// Each state is a sequence of words. Repeated successors preserve their frequency.
export function generateMarkovText(sample: string, order: number, length: number, previous = '', random = Math.random): string {
	const words = sample.trim().split(/\s+/).filter(Boolean);
	if (!Number.isInteger(order) || order < 1 || order > 10) throw new Error('Choose an order between 1 and 10.');
	if (words.length <= order) throw new Error('Add at least ' + (order + 1) + ' words, or choose a smaller order.');
	if (!Number.isInteger(length) || length < 1 || length > 1000) throw new Error('Choose a length between 1 and 1,000 words.');
	const chain = new Map<string, string[]>();
	for (let i = 0; i < words.length - order; i++) {
		const key = words.slice(i, i + order).join(' ');
		const next = chain.get(key) ?? [];
		next.push(words[i + order]);
		chain.set(key, next);
	}
	const keys = [...chain.keys()];
	const pick = <T>(options: T[]) => options[Math.floor(random() * options.length)];
	const result = previous.trim() ? previous.trim().split(/\s+/) : pick(keys).split(' ').slice(0, length);
	const target = previous.trim() ? result.length + length : length;
	while (result.length < target) {
		const possibilities = chain.get(result.slice(-order).join(' '));
		if (!possibilities) break;
		result.push(pick(possibilities));
	}
	return result.join(' ');
}
