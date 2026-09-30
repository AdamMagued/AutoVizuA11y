/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

/**
 * Configuration options for the boundary sound.
 */
export interface BoundarySoundOptions {
	/**
	 * Volume level for the boundary sound between 0 and 1.
	 * @default 0.12
	 */
	volume?: number;
	/**
	 * Duration of the boundary sound in seconds.
	 * @default 0.09
	 */
	duration?: number;
	/**
	 * Starting frequency of the boundary sound in Hz.
	 * @default 180
	 */
	startFrequency?: number;
	/**
	 * Ending frequency of the boundary sound in Hz.
	 * @default 45
	 */
	endFrequency?: number;
	/**
	 * Whether sound is enabled for this playback call.
	 * @default true
	 */
	enabled?: boolean;
}

let globalSoundEnabled = true;
let sharedAudioContext: AudioContext | null = null;

/**
 * Enable or disable navigation boundary sounds globally.
 *
 * @param {boolean} enabled - Whether boundary sounds should be enabled.
 */
export function setSoundEnabled(enabled: boolean): void {
	globalSoundEnabled = enabled;
}

/**
 * Returns whether boundary sounds are currently enabled globally.
 *
 * @returns {boolean} True if boundary sounds are enabled, false otherwise.
 */
export function isSoundEnabled(): boolean {
	return globalSoundEnabled;
}

/**
 * Get or create the shared AudioContext instance.
 * Returns null if Web Audio API is not supported in the current environment.
 *
 * @returns {AudioContext | null} The shared AudioContext or null.
 */
export function getAudioContext(): AudioContext | null {
	if (sharedAudioContext && sharedAudioContext.state !== "closed") {
		return sharedAudioContext;
	}

	if (typeof window === "undefined") {
		return null;
	}

	const AudioContextClass =
		window.AudioContext ||
		(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

	if (!AudioContextClass) {
		return null;
	}

	try {
		sharedAudioContext = new AudioContextClass();
	} catch {
		return null;
	}

	return sharedAudioContext;
}

/**
 * Sets the shared AudioContext instance (useful for testing or custom audio contexts).
 *
 * @param {AudioContext | null} context - The audio context to set as shared.
 */
export function setAudioContext(context: AudioContext | null): void {
	sharedAudioContext = context;
}

/**
 * Plays a subtle, non-intrusive boundary "bonk" sound using the Web Audio API.
 * Works safely in headless, SSR, and mocked environments.
 *
 * @param {BoundarySoundOptions} [options] - Sound playback options.
 */
export function playBoundarySound(options?: BoundarySoundOptions): void {
	if (options?.enabled === false || !globalSoundEnabled) {
		return;
	}

	try {
		const audioCtx = getAudioContext();
		if (!audioCtx) {
			return;
		}

		// Check and resume context if suspended (browser autoplay policy)
		if (audioCtx.state === "suspended") {
			audioCtx.resume().catch(() => {
				// Silently catch autoplay rejection
			});
		}

		const volume = options?.volume ?? 0.12;
		const duration = options?.duration ?? 0.09;
		const startFreq = options?.startFrequency ?? 180;
		const endFreq = options?.endFrequency ?? 45;

		const currentTime = audioCtx.currentTime;
		const osc = audioCtx.createOscillator();
		const gain = audioCtx.createGain();

		osc.type = "sine";

		// Rapid pitch drop ("bonk" / thud effect)
		osc.frequency.setValueAtTime(startFreq, currentTime);
		osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), currentTime + duration);

		// Smooth envelope to prevent clicks
		gain.gain.setValueAtTime(volume, currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, currentTime + duration);

		osc.connect(gain);
		gain.connect(audioCtx.destination);

		osc.onended = () => {
			try {
				osc.disconnect();
				gain.disconnect();
			} catch {
				// Silently catch disconnect errors
			}
		};

		osc.start(currentTime);
		osc.stop(currentTime + duration);
	} catch {
		// Audio operations should fail gracefully without disrupting navigation
	}
}
