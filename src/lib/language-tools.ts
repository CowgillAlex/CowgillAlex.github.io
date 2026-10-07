export function splitSentences(text: string): string[] {
	return text.match(/[^.!?\r\n]+[.!?]*/g)?.map(sentence => sentence.trim()).filter(Boolean) ?? [];
}

export function countText(text: string) {
	const sentences = splitSentences(text).length;
	const words = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
	return { sentences, words, characters: Array.from(text).length, withoutWhitespace: Array.from(text.replace(/\s/g, '')).length, average: sentences ? words / sentences : 0 };
}

export type WordCount = { word: string; count: number };
const pronouns = {
	first: ['i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves'],
	second: ['you', 'your', 'yours', 'yourself', 'yourselves'],
	third: ['he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves']
};
function tokens(text: string): string[] {
	return text.toLowerCase().replace(/’/g, "'").match(/\b[a-z]+(?:'[a-z]+)?\b/g) ?? [];
}
function tally(words: string[], list: string[]): WordCount[] {
	const counts = new Map<string, number>();
	for (const word of words) if (list.includes(word)) counts.set(word, (counts.get(word) ?? 0) + 1);
	return [...counts].map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}
export function countPronouns(text: string) {
	const words = tokens(text).map(word => word.replace(/'(?:m|re|ve|ll|d|s)$/, ''));
	return { first: tally(words, pronouns.first), second: tally(words, pronouns.second), third: tally(words, pronouns.third) };
}

export function countModals(text: string) {
	const contractions: Record<string, string> = { "can't": 'can', "won't": 'will', "shan't": 'shall', "cannot": 'can' };
	const words = tokens(text).map(word => contractions[word] ?? (word.endsWith("n't") ? word.slice(0, -3) : word.endsWith("'ll") ? 'will' : word.endsWith("'d") ? 'would' : word));
	const found = tally(words, ['can', 'could', 'may', 'might', 'will', 'would', 'shall', 'should', 'must', 'ought']);
	const needNot = tokens(text).filter(word => word === "needn't").length;
	if (needNot) found.push({ word: 'need', count: needNot });
	// Count "ought to" once, as a phrase rather than a separate "ought".
	const phrases = ['have to', 'has to', 'had to', 'need to', 'needs to', 'needed to', 'ought to'];
	const normalized = text.toLowerCase();
	for (const phrase of phrases) {
		const count = normalized.match(new RegExp('\\b' + phrase.replace(' ', '\\s+') + '\\b', 'g'))?.length ?? 0;
		if (count) found.push({ word: phrase, count });
		if (phrase === 'ought to' && count) {
			const ought = found.find(item => item.word === 'ought');
			if (ought) ought.count -= count;
		}
	}
	const entries = found.filter(item => item.count > 0).sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
	return {
		entries,
		epistemic: entries.filter(item => ['may', 'might', 'could', 'can', 'will', 'would', 'should', 'must', 'shall'].includes(item.word)),
		deontic: entries.filter(item => ['must', 'should', 'ought', 'can', 'may', 'need', ...phrases].includes(item.word))
	};
}

export function totalCount(entries: WordCount[]): number { return entries.reduce((sum, item) => sum + item.count, 0); }
