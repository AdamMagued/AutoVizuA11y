/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	playBoundarySound,
	setSoundEnabled,
	isSoundEnabled,
	getAudioContext,
	setAudioContext,
} from "./boundarySound";

class MockAudioParam {
	value = 0;
	setValueAtTime = vi.fn();
	exponentialRampToValueAtTime = vi.fn();
	linearRampToValueAtTime = vi.fn();
}

class MockAudioNode {
	connect = vi.fn();
	disconnect = vi.fn();
}

class MockOscillatorNode extends MockAudioNode {
	type = "sine";
	frequency = new MockAudioParam();
	start = vi.fn();
	stop = vi.fn();
	onended: (() => void) | null = null;
}

class MockGainNode extends MockAudioNode {
	gain = new MockAudioParam();
}

class MockAudioContext {
	currentTime = 0;
	state: AudioContextState = "running";
	destination = new MockAudioNode();
	createOscillator = vi.fn(() => new MockOscillatorNode());
	createGain = vi.fn(() => new MockGainNode());
	resume = vi.fn().mockResolvedValue(undefined);
}

describe("boundarySound utility", () => {
	let mockCtx: MockAudioContext;

	beforeEach(() => {
		setSoundEnabled(true);
		mockCtx = new MockAudioContext();
		setAudioContext(mockCtx as unknown as AudioContext);
	});

	afterEach(() => {
		setAudioContext(null);
		setSoundEnabled(true);
		vi.restoreAllMocks();
	});

	it("should synthesize a boundary pitch drop sound using Web Audio API", () => {
		const osc = new MockOscillatorNode();
		const gain = new MockGainNode();
		mockCtx.createOscillator.mockReturnValue(osc);
		mockCtx.createGain.mockReturnValue(gain);

		playBoundarySound();

		expect(mockCtx.createOscillator).toHaveBeenCalledTimes(1);
		expect(mockCtx.createGain).toHaveBeenCalledTimes(1);
		expect(osc.type).toBe("sine");
		expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(180, 0);
		expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(45, 0.09);
		expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.12, 0);
		expect(gain.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.0001, 0.09);
		expect(osc.connect).toHaveBeenCalledWith(gain);
		expect(gain.connect).toHaveBeenCalledWith(mockCtx.destination);
		expect(osc.start).toHaveBeenCalledWith(0);
		expect(osc.stop).toHaveBeenCalledWith(0.09);

		// Verify cleanup
		expect(osc.onended).toBeDefined();
		osc.onended!();
		expect(osc.disconnect).toHaveBeenCalledTimes(1);
		expect(gain.disconnect).toHaveBeenCalledTimes(1);
	});

	it("should resume context if suspended", () => {
		mockCtx.state = "suspended";
		playBoundarySound();
		expect(mockCtx.resume).toHaveBeenCalledTimes(1);
	});

	it("should respect custom options", () => {
		const osc = new MockOscillatorNode();
		const gain = new MockGainNode();
		mockCtx.createOscillator.mockReturnValue(osc);
		mockCtx.createGain.mockReturnValue(gain);

		playBoundarySound({
			volume: 0.25,
			duration: 0.15,
			startFrequency: 220,
			endFrequency: 50,
		});

		expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(220, 0);
		expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(50, 0.15);
		expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.25, 0);
		expect(gain.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.0001, 0.15);
	});

	it("should not play when options.enabled is false", () => {
		playBoundarySound({ enabled: false });
		expect(mockCtx.createOscillator).not.toHaveBeenCalled();
	});

	it("should not play when globally disabled", () => {
		setSoundEnabled(false);
		expect(isSoundEnabled()).toBe(false);

		playBoundarySound();
		expect(mockCtx.createOscillator).not.toHaveBeenCalled();
	});

	it("should handle null AudioContext gracefully in headless environments", () => {
		setAudioContext(null);
		const originalAudioContext = window.AudioContext;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (window as any).AudioContext;

		expect(() => playBoundarySound()).not.toThrow();

		window.AudioContext = originalAudioContext;
	});

	it("should catch errors thrown by Web Audio API gracefully without throwing", () => {
		mockCtx.createOscillator.mockImplementation(() => {
			throw new Error("Audio device error");
		});

		expect(() => playBoundarySound()).not.toThrow();
	});

	it("getAudioContext returns null when AudioContext is unavailable", () => {
		setAudioContext(null);
		const originalAudioContext = window.AudioContext;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (window as any).AudioContext;

		const ctx = getAudioContext();
		expect(ctx).toBeNull();

		window.AudioContext = originalAudioContext;
	});
});
