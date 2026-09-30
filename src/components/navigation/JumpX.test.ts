/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { jumpXElements, jumpXCharts } from "./JumpX";
import * as boundarySoundModule from "../../utils/boundarySound";

describe("JumpX navigation boundary detection", () => {
	let playBoundarySoundSpy: ReturnType<typeof vi.spyOn<typeof boundarySoundModule, "playBoundarySound">>;

	beforeEach(() => {
		playBoundarySoundSpy = vi.spyOn(boundarySoundModule, "playBoundarySound").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = "";
	});

	describe("jumpXElements", () => {
		function createElements(count: number, className = ""): HTMLElement[] {
			const elements: HTMLElement[] = [];
			for (let i = 0; i < count; i++) {
				const el = document.createElement("div");
				el.tabIndex = 0;
				if (className) {
					el.className = className;
				}
				document.body.appendChild(el);
				elements.push(el);
			}
			return elements;
		}

		function createKeyboardEvent(key: string): {
			event: React.KeyboardEvent;
			preventDefault: ReturnType<typeof vi.fn>;
		} {
			const preventDefault = vi.fn();
			const nativeEvent = {
				key,
				preventDefault,
			} as unknown as KeyboardEvent;

			const event = {
				key,
				nativeEvent,
			} as unknown as React.KeyboardEvent;

			return { event, preventDefault };
		}

		it("should trigger boundary sound when pressing ArrowLeft at the first element (start boundary)", async () => {
			const elements = createElements(3);
			elements[0].focus();
			expect(document.activeElement).toBe(elements[0]);

			const { event, preventDefault } = createKeyboardEvent("ArrowLeft");

			await jumpXElements({
				event,
				number: 1,
				elements,
				selectedSeries: "",
				series: [],
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: true });
			expect(document.activeElement).toBe(elements[0]);
		});

		it("should NOT trigger boundary sound when navigating left within collection", async () => {
			const elements = createElements(3);
			elements[1].focus();
			expect(document.activeElement).toBe(elements[1]);

			const { event, preventDefault } = createKeyboardEvent("ArrowLeft");

			await jumpXElements({
				event,
				number: 1,
				elements,
				selectedSeries: "",
				series: [],
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(elements[0]);
		});

		it("should trigger boundary sound when pressing ArrowRight at the last element (end boundary)", async () => {
			const elements = createElements(3);
			elements[2].focus();
			expect(document.activeElement).toBe(elements[2]);

			const { event, preventDefault } = createKeyboardEvent("ArrowRight");

			await jumpXElements({
				event,
				number: 1,
				elements,
				selectedSeries: "",
				series: [],
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: true });
			expect(document.activeElement).toBe(elements[2]);
		});

		it("should NOT trigger boundary sound when navigating right within collection", async () => {
			const elements = createElements(3);
			elements[1].focus();
			expect(document.activeElement).toBe(elements[1]);

			const { event, preventDefault } = createKeyboardEvent("ArrowRight");

			await jumpXElements({
				event,
				number: 1,
				elements,
				selectedSeries: "",
				series: [],
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(elements[2]);
		});

		it("should respect sound = false opt-out at boundaries", async () => {
			const elements = createElements(3);
			elements[0].focus();

			const { event, preventDefault } = createKeyboardEvent("ArrowLeft");

			await jumpXElements({
				event,
				number: 1,
				elements,
				selectedSeries: "",
				series: [],
				sound: false,
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: false });
		});

		it("should trigger boundary sound at both boundaries for a single-element collection", async () => {
			const elements = createElements(1);
			elements[0].focus();

			const left = createKeyboardEvent("ArrowLeft");
			await jumpXElements({
				event: left.event,
				number: 1,
				elements,
				selectedSeries: "",
				series: [],
			});
			expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);

			const right = createKeyboardEvent("ArrowRight");
			await jumpXElements({
				event: right.event,
				number: 1,
				elements,
				selectedSeries: "",
				series: [],
			});
			expect(playBoundarySoundSpy).toHaveBeenCalledTimes(2);
		});

		it("should correctly handle series filtering for boundary detection", async () => {
			const seriesA = createElements(2, "series-a");
			const seriesB = createElements(2, "series-b");
			const allElements = [...seriesA, ...seriesB];

			seriesA[0].focus();

			const { event, preventDefault } = createKeyboardEvent("ArrowLeft");

			await jumpXElements({
				event,
				number: 1,
				elements: allElements,
				selectedSeries: "series-a",
				series: ["series-a", "series-b"],
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe("jumpXCharts", () => {
		function createCharts(count: number): HTMLElement[] {
			const charts: HTMLElement[] = [];
			for (let i = 0; i < count; i++) {
				const el = document.createElement("div");
				el.tabIndex = 0;
				document.body.appendChild(el);
				charts.push(el);
			}
			return charts;
		}

		function createKeyboardEvent(key: string): {
			event: React.KeyboardEvent;
			preventDefault: ReturnType<typeof vi.fn>;
		} {
			const preventDefault = vi.fn();
			const nativeEvent = {
				key,
				preventDefault,
			} as unknown as KeyboardEvent;

			const event = {
				key,
				nativeEvent,
			} as unknown as React.KeyboardEvent;

			return { event, preventDefault };
		}

		it("should trigger boundary sound when pressing ArrowLeft at the first chart", () => {
			const charts = createCharts(3);
			charts[0].focus();

			const { event, preventDefault } = createKeyboardEvent("ArrowLeft");

			jumpXCharts({
				event,
				charts,
				chart: charts[0],
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: true });
			expect(document.activeElement).toBe(charts[0]);
		});

		it("should trigger boundary sound when pressing ArrowRight at the last chart", () => {
			const charts = createCharts(3);
			charts[2].focus();

			const { event, preventDefault } = createKeyboardEvent("ArrowRight");

			jumpXCharts({
				event,
				charts,
				chart: charts[2],
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: true });
			expect(document.activeElement).toBe(charts[2]);
		});

		it("should NOT trigger boundary sound when moving between charts", () => {
			const charts = createCharts(3);
			charts[1].focus();

			const { event, preventDefault } = createKeyboardEvent("ArrowLeft");

			jumpXCharts({
				event,
				charts,
				chart: charts[1],
			});

			expect(preventDefault).toHaveBeenCalledTimes(1);
			expect(playBoundarySoundSpy).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(charts[0]);
		});

		it("should respect sound = false in jumpXCharts", () => {
			const charts = createCharts(2);
			charts[0].focus();

			const { event } = createKeyboardEvent("ArrowLeft");

			jumpXCharts({
				event,
				charts,
				chart: charts[0],
				sound: false,
			});

			expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: false });
		});
	});
});
