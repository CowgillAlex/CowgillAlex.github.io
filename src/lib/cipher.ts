export function substituteLetters(text: string, replacements: Record<string, string>): string {
	return text.replace(/[a-z]/gi, letter => {
		const replacement = replacements[letter.toLowerCase()];
		if (!replacement) return letter;
		return letter === letter.toUpperCase() ? replacement.toUpperCase() : replacement.toLowerCase();
	});
}
