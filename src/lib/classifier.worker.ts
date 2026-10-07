import { env, pipeline } from '@huggingface/transformers';
import type { TextClassificationPipeline } from '@huggingface/transformers';
import { splitSentences } from './language-tools.ts';

env.allowLocalModels = false;
env.backends.onnx.wasm!.numThreads = 1;
let classifier: TextClassificationPipeline | undefined;
let busy = false;
const models = {
	sentiment: { id: 'shukitchan2023/robust-sentiment-analysis-ONNX', revision: 'f4e9bda73206256ad8603efa57c7069c54afa676' },
	politeness: { id: 'Intel/polite-guard', revision: 'b302b4b49319b6c7fb79dda6607d53526ac3a022' }
};
self.onmessage = async (event: MessageEvent<{ kind: keyof typeof models; text: string }>) => {
	if (busy) return;
	busy = true;
	try {
		if (!classifier) {
			self.postMessage({ type: 'status', message: 'Loading model...' });
			const model = models[event.data.kind];
			classifier = await pipeline('text-classification', model.id, {
				revision: model.revision,
				dtype: 'q8',
				device: 'wasm',
				progress_callback: progress => {
					if (progress.status === 'progress') self.postMessage({ type: 'status', message: `Downloading ${progress.file}: ${Math.round(progress.progress)}%` });
				}
			});
		}
		const sentences = splitSentences(event.data.text);
		const results = [];
		for (let index = 0; index < sentences.length; index++) {
			self.postMessage({ type: 'status', message: `Analysing sentence ${index + 1} of ${sentences.length}...` });
			const output = await classifier(sentences[index], { top_k: 1 });
			const result = output[0] as { label: string; score: number };
			results.push({ sentence: sentences[index], label: result.label, score: result.score });
		}
		self.postMessage({ type: 'result', results });
	} catch (error) {
		self.postMessage({ type: 'error', message: error instanceof Error ? error.message : 'Analysis failed.' });
	} finally { busy = false; }
};
