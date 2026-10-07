import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateMetaTags, generateUVCoordinates, toSingleLine } from '../src/lib/text-tools.ts';
import { countText, countPronouns, countModals, splitSentences, totalCount } from '../src/lib/language-tools.ts';

test('metadata escapes user values and includes the author field', () => {
	const result = generateMetaTags({ title: 'A "title" <script>', description: 'One & two', author: 'Alex', url: 'https://example.com/?a=1&b=2', keywords: '' });
	assert.ok(result.includes('<title>A &quot;title&quot; &lt;script&gt;</title>'));
	assert.ok(result.includes('name="author" content="Alex"'));
	assert.ok(result.includes('https://example.com/?a=1&amp;b=2'));
	assert.ok(!result.includes('name="keywords"'));
});
test('UV output retains the original triangle order and rejects invalid tiles', () => {
	assert.deepEqual(generateUVCoordinates(256, 128, 16, 32, 16, 32, 'grass').split('\n'), [
		'// GRASS', 'new Vector2f(0.0625f, 0.2500f),', 'new Vector2f(0.0625f, 0.5000f),',
		'new Vector2f(0.1250f, 0.5000f),', 'new Vector2f(0.1250f, 0.5000f),',
		'new Vector2f(0.1250f, 0.2500f),', 'new Vector2f(0.0625f, 0.2500f),'
	]);
	assert.throws(() => generateUVCoordinates(0, 128, 0, 0, 16, 16), /positive dimensions/);
	assert.throws(() => generateUVCoordinates(128, 128, 120, 0, 16, 16), /fit inside/);
});
test('single-line conversion handles Windows and Unicode line breaks without changing other whitespace', () => {
	assert.equal(toSingleLine('a\r\nb\rc\nd\u2028e\u2029f\t g'), 'a b c d e f\t g');
});
test('text counts include contractions and Unicode words, with zero counts for blank input', () => {
	assert.deepEqual(countText(''), { sentences: 0, words: 0, characters: 0, withoutWhitespace: 0, average: 0 });
	const result = countText("I'm here. Café time!\nAnother line");
	assert.equal(result.sentences, 3); assert.equal(result.words, 6); assert.equal(result.average, 2);
	assert.deepEqual(splitSentences('One?\nTwo! Last line'), ['One?', 'Two!', 'Last line']);
	assert.deepEqual(splitSentences('One line\nAnother line'), ['One line', 'Another line']);
});
test('pronoun contractions and case are counted without matching inside words', () => {
	const counts = countPronouns("I’m here, you're there. THEY’RE with us. Theme myself.");
	assert.equal(totalCount(counts.first), 3); assert.equal(totalCount(counts.second), 1); assert.equal(totalCount(counts.third), 1);
});
test('modal totals do not double-count phrases or shared categories', () => {
	const counts = countModals("We ought to go. You must help; I can’t. They need to leave and she'll stay.");
	assert.equal(totalCount(counts.entries), 5);
	assert.ok(!counts.entries.some(item => item.word === 'ought'));
	assert.equal(counts.entries.find(item => item.word === 'ought to')?.count, 1);
	assert.equal(counts.entries.find(item => item.word === 'can')?.count, 1);
	assert.equal(totalCount(counts.epistemic), 3); assert.equal(totalCount(counts.deontic), 4);
	assert.equal(totalCount(countModals("You needn't go, but they need to stay.").entries), 2);
});
