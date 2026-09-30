/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import { Section } from "../../../assets/data/GuideData";
import * as constants from "../../../constants";
import { getShortcutAriaLabel } from "../../../utils/shortcutAriaLabel";
import type { TFunction } from "i18next";

interface ShortcutGuideSectionProps {
	section: Section;
	sectionIndex: number;
	t: TFunction;
}

export const ShortcutGuideSection = ({ section, sectionIndex, t }: ShortcutGuideSectionProps) => {
	return (
		<div className={constants.SHORTCUTGUIDE_CLASSES.shortcutGuideSection}>
			<h3
				className={constants.SHORTCUTGUIDE_CLASSES.shortcutGuideListTitle}
				id={`listHeader${sectionIndex}`}
			>
				{t(section.title)}
			</h3>
			<dl
				className={constants.SHORTCUTGUIDE_CLASSES.shortcutGuideList}
				aria-labelledby={`listHeader${sectionIndex}`}
			>
				{section.shortcuts.map((shortcut, shortcutIndex) => {
					const keyAriaLabel = getShortcutAriaLabel(shortcut.keys, shortcut.ariaLabel, t);

					return (
						<div key={shortcutIndex} className={constants.SHORTCUTGUIDE_CLASSES.shortcutGuideRow}>
							<dt
								className={constants.SHORTCUTGUIDE_CLASSES.shortcutGuideCellShortcut}
								aria-label={keyAriaLabel}
							>
								{keyAriaLabel ? (
									<>
										<span className="visually-hidden sr-only">{keyAriaLabel}</span>
										<span aria-hidden="true">{shortcut.keys}</span>
									</>
								) : (
									shortcut.keys
								)}
							</dt>
							<dd className={constants.SHORTCUTGUIDE_CLASSES.shortcutGuideCellExplanation}>
								{t(shortcut.description)}
							</dd>
						</div>
					);
				})}
			</dl>
		</div>
	);
};
