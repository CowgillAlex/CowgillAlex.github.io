import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateMarkovText } from '../src/lib/markov.ts';
import { substituteLetters } from '../src/lib/cipher.ts';
import { parseTimerSeconds, formatDuration } from '../src/lib/time.ts';

test('short Markov samples give a useful error instead of crashing', () => {
	assert.throws(() => generateMarkovText('cat', 3, 50), /at least 4 words/);
	assert.throws(() => generateMarkovText('   ', 1, 50), /at least 2 words/);
});
test('Markov generation respects the length and extends without repeating the existing text', () => {
	assert.equal(generateMarkovText('one two three four five six', 1, 4, '', () => 0), 'one two three four');
	assert.equal(generateMarkovText('one two three four five six', 1, 2, 'one two', () => 0), 'one two three four');
	assert.equal(generateMarkovText('one two three', 1, 50, '', () => 0), 'one two three');
});
test('cipher replacements preserve case, punctuation and unmapped letters', () => {
	assert.equal(substituteLetters('Abba! 123 z', { a: 'x', b: 'y' }), 'Xyyx! 123 z');
});
test('timer URLs reject invalid durations and support hour-long timers', () => {
	for (const value of [null, '', ' ', '-1', '0', 'NaN', 'Infinity', '1.5', '86401']) assert.equal(parseTimerSeconds(value), null);
	assert.equal(parseTimerSeconds('3600'), 3600);
	assert.equal(formatDuration(3600000), '01:00:00');
	assert.equal(formatDuration(-100), '00:00');
});
