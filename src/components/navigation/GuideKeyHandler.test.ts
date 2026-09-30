/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { guideKeyHandler } from "./GuideKeyHandler";
import * as constants from "../../constants";
import * as boundarySoundModule from "../../utils/boundarySound";

describe("GuideKeyHandler boundary navigation", () => {
	let playBoundarySoundSpy: ReturnType<typeof vi.spyOn<typeof boundarySoundModule, "playBoundarySound">>;
	let dialog: HTMLDialogElement;
	let shortcutGuideRef: React.RefObject<HTMLDialogElement>;
	let setIsShortcutGuideOpen: ReturnType<typeof vi.fn>;

	function createRows(count: number): HTMLElement[] {
		const rows: HTMLElement[] = [];
		for (let i = 0; i < count; i++) {
			const row = document.createElement("div");
			row.className = constants.SHORTCUTGUIDE_CLASSES.shortcutGuideRow;
			row.tabIndex = 0;
			dialog.appendChild(row);
			rows.push(row);
		}
		return rows;
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
			preventDefault,
			nativeEvent,
		} as unknown as React.KeyboardEvent;

		return { event, preventDefault };
	}

	beforeEach(() => {
		playBoundarySoundSpy = vi.spyOn(boundarySoundModule, "playBoundarySound").mockImplementation(() => {});
		dialog = document.createElement("dialog");
		dialog.showModal = vi.fn();
		dialog.close = vi.fn();
		document.body.appendChild(dialog);

		shortcutGuideRef = { current: dialog };
		setIsShortcutGuideOpen = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = "";
	});

	it("should trigger boundary sound when pressing ArrowLeft at the first row", () => {
		const rows = createRows(3);
		rows[0].focus();
		expect(document.activeElement).toBe(rows[0]);

		const { event, preventDefault } = createKeyboardEvent("ArrowLeft");

		guideKeyHandler({
			event,
			shortcutGuideRef,
			setIsShortcutGuideOpen,
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: true });
		expect(document.activeElement).toBe(rows[0]);
	});

	it("should NOT trigger boundary sound when navigating left from row 1 to row 0", () => {
		const rows = createRows(3);
		rows[1].focus();
		expect(document.activeElement).toBe(rows[1]);

		const { event, preventDefault } = createKeyboardEvent("ArrowLeft");

		guideKeyHandler({
			event,
			shortcutGuideRef,
			setIsShortcutGuideOpen,
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(rows[0]);
	});

	it("should trigger boundary sound when pressing ArrowRight at the last row", () => {
		const rows = createRows(3);
		rows[2].focus();
		expect(document.activeElement).toBe(rows[2]);

		const { event, preventDefault } = createKeyboardEvent("ArrowRight");

		guideKeyHandler({
			event,
			shortcutGuideRef,
			setIsShortcutGuideOpen,
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: true });
		expect(document.activeElement).toBe(rows[2]);
	});

	it("should NOT trigger boundary sound when navigating right from row 0 to row 1", () => {
		const rows = createRows(3);
		rows[0].focus();
		expect(document.activeElement).toBe(rows[0]);

		const { event, preventDefault } = createKeyboardEvent("ArrowRight");

		guideKeyHandler({
			event,
			shortcutGuideRef,
			setIsShortcutGuideOpen,
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(playBoundarySoundSpy).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(rows[1]);
	});

	it("should respect sound = false in guideKeyHandler", () => {
		const rows = createRows(2);
		rows[0].focus();

		const { event } = createKeyboardEvent("ArrowLeft");

		guideKeyHandler({
			event,
			shortcutGuideRef,
			setIsShortcutGuideOpen,
			sound: false,
		});

		expect(playBoundarySoundSpy).toHaveBeenCalledWith({ enabled: false });
	});

	it("should trigger boundary sound at both boundaries for a single-row ShortcutGuide", () => {
		const rows = createRows(1);
		rows[0].focus();

		const left = createKeyboardEvent("ArrowLeft");
		guideKeyHandler({
			event: left.event,
			shortcutGuideRef,
			setIsShortcutGuideOpen,
		});
		expect(playBoundarySoundSpy).toHaveBeenCalledTimes(1);

		const right = createKeyboardEvent("ArrowRight");
		guideKeyHandler({
			event: right.event,
			shortcutGuideRef,
			setIsShortcutGuideOpen,
		});
		expect(playBoundarySoundSpy).toHaveBeenCalledTimes(2);
	});

	it("should close dialog on Escape", () => {
		const rows = createRows(1);
		rows[0].focus();

		const { event, preventDefault } = createKeyboardEvent("Escape");

		guideKeyHandler({
			event,
			shortcutGuideRef,
			setIsShortcutGuideOpen,
		});

		expect(preventDefault).toHaveBeenCalledTimes(1);
		expect(dialog.close).toHaveBeenCalledTimes(1);
		expect(setIsShortcutGuideOpen).toHaveBeenCalledWith(false);
	});
});
