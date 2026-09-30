/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import * as constants from "../../constants";

/**
 * Updates the roving tabindex across shortcut guide rows and moves focus to the target row.
 *
 * @param {HTMLElement[]} rows - All shortcut rows in the guide.
 * @param {number} targetIndex - Index of the row to focus.
 */
function updateRowFocus(rows: HTMLElement[], targetIndex: number): void {
	rows.forEach((row, index) => {
		row.setAttribute("tabindex", index === targetIndex ? "0" : "-1");
	});
	const targetRow = rows[targetIndex];
	targetRow.focus();
	targetRow.scrollIntoView?.({ block: "nearest" });
}

/**
 * Handles the pressing of down arrow or right arrow key inside the Shortcut Guide.
 *
 * @param {React.KeyboardEvent} event - The keyboard event.
 * @param {React.RefObject<HTMLDialogElement>} shortcutGuideRef - Reference to the shortcut guide dialog.
 */
export function handleArrowDown(
	event: React.KeyboardEvent,
	shortcutGuideRef: React.RefObject<HTMLDialogElement>,
): void {
	event.preventDefault();

	const shortcutGuide = shortcutGuideRef.current;
	if (!shortcutGuide) return;

	const rows = Array.from(
		shortcutGuide.querySelectorAll<HTMLElement>(`.${constants.SHORTCUTGUIDE_CLASSES.shortcutGuideRow}`),
	);
	if (rows.length === 0) return;

	const activeElement = document.activeElement;
	const currentRowIndex = rows.findIndex((row) => row === activeElement || row.contains(activeElement));

	const nextIndex = currentRowIndex === -1 ? 0 : currentRowIndex + 1;

	if (nextIndex < rows.length) {
		updateRowFocus(rows, nextIndex);
	}
}

/**
 * Handles the pressing of up arrow or left arrow key inside the Shortcut Guide.
 *
 * @param {React.KeyboardEvent} event - The keyboard event.
 * @param {React.RefObject<HTMLDialogElement>} shortcutGuideRef - Reference to the shortcut guide dialog.
 */
export function handleArrowUp(
	event: React.KeyboardEvent,
	shortcutGuideRef: React.RefObject<HTMLDialogElement>,
): void {
	event.preventDefault();

	const shortcutGuide = shortcutGuideRef.current;
	if (!shortcutGuide) return;

	const rows = Array.from(
		shortcutGuide.querySelectorAll<HTMLElement>(`.${constants.SHORTCUTGUIDE_CLASSES.shortcutGuideRow}`),
	);
	if (rows.length === 0) return;

	const activeElement = document.activeElement;
	const currentRowIndex = rows.findIndex((row) => row === activeElement || row.contains(activeElement));

	let prevIndex = currentRowIndex - 1;
	if (currentRowIndex === -1) {
		prevIndex = rows.length - 1;
	}

	if (prevIndex >= 0) {
		updateRowFocus(rows, prevIndex);
	}
}

/**
 * Handles the pressing of right arrow key inside the Shortcut Guide.
 */
export const handleArrowRight = handleArrowDown;

/**
 * Handles the pressing of left arrow key inside the Shortcut Guide.
 */
export const handleArrowLeft = handleArrowUp;

/**
 * Listens for shortcutGuide related keypresses and handles the outcomes.
 *
 * @param {React.KeyboardEvent} event - The keyboard event.
 * @param {React.RefObject<HTMLDialogElement>} shortcutGuideRef - Reference to the shortcut guide dialog.
 * @param {(bool: boolean) => void} setIsShortcutGuideOpen - Setter function for shortcut guide open state.
 */
export function guideKeyHandler({
	event,
	shortcutGuideRef,
	setIsShortcutGuideOpen,
}: {
	event: React.KeyboardEvent;
	shortcutGuideRef: React.RefObject<HTMLDialogElement>;
	setIsShortcutGuideOpen: (bool: boolean) => void;
}): void {
	const { key } = event;

	const shouldHandleKey = shortcutGuideRef.current?.contains(document.activeElement);

	switch (key) {
		case "Escape":
		case "?":
			if (shouldHandleKey) {
				event.preventDefault();
				returnGuide(shortcutGuideRef, setIsShortcutGuideOpen);
			}
			break;
		case "ArrowDown":
		case "ArrowRight":
			if (shouldHandleKey) {
				handleArrowDown(event, shortcutGuideRef);
			}
			break;
		case "ArrowUp":
		case "ArrowLeft":
			if (shouldHandleKey) {
				handleArrowUp(event, shortcutGuideRef);
			}
			break;
		default:
			break;
	}

	return;
}

/**
 * Hides the ShortcutGuide and gives keyboard focus to the previously focused element.
 *
 * @param {React.RefObject<HTMLElement>} chartRef - Reference to the chart element.
 */
export function returnGuide(
	shortcutGuideRef: React.RefObject<HTMLDialogElement>,
	setIsShortcutGuideOpen: (bool: boolean) => void,
): void {
	shortcutGuideRef.current!.close();
	setIsShortcutGuideOpen(false);
}
