/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import type { TFunction } from "i18next";

const ARROW_KEY_TO_I18N: Record<string, string> = {
	"↓": "sg_down_arrow",
	"↑": "sg_up_arrow",
	"→": "sg_right_arrow",
	"←": "sg_left_arrow",
};

const ARROW_KEY_FALLBACK: Record<string, string> = {
	"↓": "Down Arrow",
	"↑": "Up Arrow",
	"→": "Right Arrow",
	"←": "Left Arrow",
};

/**
 * Returns an accessible label for shortcut keys, translating arrow symbols for screen readers.
 *
 * @param {string} keys - The shortcut key string (e.g. "↓" or "Alt + M").
 * @param {string} [ariaLabel] - Optional i18n translation key or explicit label.
 * @param {TFunction} [t] - Optional translation function.
 * @returns {string | undefined} Accessible label or undefined if no special label is needed.
 */
export function getShortcutAriaLabel(
	keys: string,
	ariaLabel?: string,
	t?: TFunction,
): string | undefined {
	if (ariaLabel) {
		return t ? t(ariaLabel) : ariaLabel;
	}

	const arrowRegex = /[↓↑→←]/g;
	if (arrowRegex.test(keys)) {
		return keys.replace(arrowRegex, (match) => {
			const i18nKey = ARROW_KEY_TO_I18N[match];
			if (i18nKey && t) {
				return t(i18nKey);
			}
			return ARROW_KEY_FALLBACK[match] ?? match;
		});
	}

	return undefined;
}
