/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { skip } from "./Skip";
import * as boundarySoundModule from "../../utils/boundarySound";

describe("Skip navigation boundary detection", () => {
	let playBoundarySoundSpy: ReturnType<typeof vi.spyOn<typeof boundarySoundModule, "playBoundarySound">>;
	let chartContainer: HTMLDivElement;
	let chartRef: React.RefObject<HTMLDivElement>;

	function createElements(count: number): HTMLElement[] {
		const elements: HTMLElement[] = [];
		for (let i = 0; i < count; i++) {
			const el = document.createElement("rect");
			el.tabIndex = 0;
			chartContainer.appendChild(el);
			elements.push(el);
		}
		return elements;
	}

	function createSkipEvent(code: string, altKey = false): {
		event: React.KeyboardEvent;
		preventDefault: ReturnType<typeof vi.fn>;
	} {
		const preventDefault = vi.fn();
		const nativeEvent = {
			code,
			altKey,
			preventDefault,
		} as unknown as KeyboardEvent;
		Object.setPrototypeOf(nativeEvent, KeyboardEvent.prototype);

		const event = {
			nativeEvent,
		} as unknown as React.KeyboardEvent;

		return { event, preventDefault };
	}

	beforeEach(() => {
		playBoundarySoundSpy = vi.spyOn(boundarySoundModule, "playBoundarySound").mockImplementation(() => {});
		chartContainer = document.createElement("div");
		document.body.appendChild(chartContainer);
		chartRef = { current: chartContainer };
	});

	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = "";
	});

	it("should trigger boundary sound when skipping to beginning while already at first element (Home)", () => {
		const elements = createElements(3);
		elements[0].focus();
		expect(document.activeElement).toBe(elements[0]);

		const { event, preventDefault } = createSkipEvent("Home");

		skip({
			event,
			chartRef,
			selectorType: { element: "rect" },
			selectedSeries: "",
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: true });
		expect(document.activeElement).toBe(elements[0]);
	});

	it("should trigger boundary sound when skipping to beginning while already at first element (Alt+Q)", () => {
		const elements = createElements(3);
		elements[0].focus();

		const { event, preventDefault } = createSkipEvent("KeyQ", true);

		skip({
			event,
			chartRef,
			selectorType: { element: "rect" },
			selectedSeries: "",
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
	});

	it("should NOT trigger boundary sound when skipping to beginning from a non-first element", () => {
		const elements = createElements(3);
		elements[2].focus();
		expect(document.activeElement).toBe(elements[2]);

		const { event, preventDefault } = createSkipEvent("Home");

		skip({
			event,
			chartRef,
			selectorType: { element: "rect" },
			selectedSeries: "",
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(elements[0]);
	});

	it("should trigger boundary sound when skipping to end while already at last element (End)", () => {
		const elements = createElements(3);
		elements[2].focus();
		expect(document.activeElement).toBe(elements[2]);

		const { event, preventDefault } = createSkipEvent("End");

		skip({
			event,
			chartRef,
			selectorType: { element: "rect" },
			selectedSeries: "",
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: true });
		expect(document.activeElement).toBe(elements[2]);
	});

	it("should trigger boundary sound when skipping to end while already at last element (Alt+W)", () => {
		const elements = createElements(3);
		elements[2].focus();

		const { event, preventDefault } = createSkipEvent("KeyW", true);

		skip({
			event,
			chartRef,
			selectorType: { element: "rect" },
			selectedSeries: "",
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
	});

	it("should NOT trigger boundary sound when skipping to end from a non-last element", () => {
		const elements = createElements(3);
		elements[0].focus();
		expect(document.activeElement).toBe(elements[0]);

		const { event, preventDefault } = createSkipEvent("End");

		skip({
			event,
			chartRef,
			selectorType: { element: "rect" },
			selectedSeries: "",
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(elements[2]);
	});

	it("should respect sound = false when skipping at boundary", () => {
		const elements = createElements(3);
		elements[0].focus();

		const { event } = createSkipEvent("Home");

		skip({
			event,
			chartRef,
			selectorType: { element: "rect" },
			selectedSeries: "",
			sound: false,
		});

		expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: false });
	});
});
