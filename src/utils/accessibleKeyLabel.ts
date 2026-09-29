/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import type { TFunction } from "i18next";

interface KeyMapping {
	i18nKey: string;
	fallback: string;
}

const ARROW_KEY_MAP: Record<string, KeyMapping> = {
	"↑": { i18nKey: "sg_arrow_up", fallback: "Up arrow" },
	"↓": { i18nKey: "sg_arrow_down", fallback: "Down arrow" },
	"←": { i18nKey: "sg_arrow_left", fallback: "Left arrow" },
	"→": { i18nKey: "sg_arrow_right", fallback: "Right arrow" },
	"Up Arrow": { i18nKey: "sg_arrow_up", fallback: "Up arrow" },
	"Down Arrow": { i18nKey: "sg_arrow_down", fallback: "Down arrow" },
	"Left Arrow": { i18nKey: "sg_arrow_left", fallback: "Left arrow" },
	"Right Arrow": { i18nKey: "sg_arrow_right", fallback: "Right arrow" },
	"Up arrow": { i18nKey: "sg_arrow_up", fallback: "Up arrow" },
	"Down arrow": { i18nKey: "sg_arrow_down", fallback: "Down arrow" },
	"Left arrow": { i18nKey: "sg_arrow_left", fallback: "Left arrow" },
	"Right arrow": { i18nKey: "sg_arrow_right", fallback: "Right arrow" },
	"ArrowUp": { i18nKey: "sg_arrow_up", fallback: "Up arrow" },
	"ArrowDown": { i18nKey: "sg_arrow_down", fallback: "Down arrow" },
	"ArrowLeft": { i18nKey: "sg_arrow_left", fallback: "Left arrow" },
	"ArrowRight": { i18nKey: "sg_arrow_right", fallback: "Right arrow" },
};

/**
 * Maps arrow glyphs and key strings to accessible localized labels using i18n translations,
 * falling back to human-readable strings.
 *
 * @param key The key string or symbol to map
 * @param t Optional i18n translation function
 * @returns The accessible key label
 */
export function accessibleKeyLabel(
	key: string,
	t?: TFunction | ((translationKey: string) => string)
): string {
	if (!key) {
		return "";
	}

	const directMatch = ARROW_KEY_MAP[key];
	if (directMatch) {
		if (t) {
			const translated = t(directMatch.i18nKey);
			if (translated && translated !== directMatch.i18nKey) {
				return translated;
			}
		}
		return directMatch.fallback;
	}

	if (/[↑↓←→]/.test(key)) {
		return key.replace(/[↑↓←→]/g, (glyph) => {
			const mapping = ARROW_KEY_MAP[glyph];
			if (mapping) {
				if (t) {
					const translated = t(mapping.i18nKey);
					if (translated && translated !== mapping.i18nKey) {
						return translated;
					}
				}
				return mapping.fallback;
			}
			return glyph;
		});
	}

	return key;
}
