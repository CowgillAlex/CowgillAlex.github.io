export function parseTimerSeconds(value: string | null): number | null {
	if (!value?.trim()) return null;
	const seconds = Number(value);
	return Number.isInteger(seconds) && seconds > 0 && seconds <= 86400 ? seconds : null;
}

export function formatDuration(milliseconds: number, fractions = false): string {
	const ms = Math.max(0, milliseconds);
	const seconds = Math.floor(ms / 1000);
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor(seconds / 60) % 60;
	const pad = (value: number) => String(value).padStart(2, '0');
	const whole = (hours ? pad(hours) + ':' : '') + pad(minutes) + ':' + pad(seconds % 60);
	return whole + (fractions ? '.' + Math.floor(ms % 1000 / 100) : '');
}
