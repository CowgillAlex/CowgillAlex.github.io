export * from '@tensorflow/tfjs-core';
export * from '@tensorflow/tfjs-layers';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { ready, setBackend } from '@tensorflow/tfjs-core';

let initialization: Promise<void> | undefined;
export function initializeTensor(): Promise<void> {
	return initialization ??= (async () => {
		try { if (!await setBackend('webgl')) await setBackend('cpu'); }
		catch { await setBackend('cpu'); }
		await ready();
	})();
}
