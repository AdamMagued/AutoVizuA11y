/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import { TFunction } from "i18next";

/**
 * Predefined chart type descriptions in English.
 */
export const DEFAULT_CHART_TYPE_DESCRIPTIONS: Record<string, string> = {
	bar: "A bar chart uses rectangular bars to compare values across categories, with bar lengths proportional to values.",
	line: "A line chart connects data points with straight lines to show trends over continuous intervals or time.",
	pie: "A pie chart is a circular graphic divided into slices illustrating numerical proportions of a whole.",
	scatter: "A scatter plot plots dots on two numeric axes to display relationships or correlations between variables.",
	treemap: "A treemap displays hierarchical data as nested rectangles sized and colored by data dimensions.",
	heatmap: "A heatmap displays values using a color scale on a two-dimensional grid to show variations.",
	area: "An area chart displays quantitative data with colored areas below lines to show volume trends over time.",
	histogram: "A histogram displays numerical data distribution by grouping continuous values into bins.",
	boxplot: "A box plot displays numerical data through quartiles, showing the median, spread, and outliers.",
};

export interface GetChartTypeDescriptionParams {
	type: string;
	chartTypeDescription?: string | Record<string, string>;
	chartTypeDescriptions?: Record<string, string>;
	t?: TFunction<"translation", undefined> | ((key: string, options?: Record<string, unknown>) => string);
}

/**
 * Resolves a chart type string to a known normalized category.
 *
 * @param {string} type - The chart type identifier.
 * @returns {string | undefined} Normalized category name or undefined if unrecognized.
 */
export function resolveChartCategory(type: string): string | undefined {
	if (!type || typeof type !== "string") return undefined;
	const normalized = type.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();

	if (normalized.includes("scatter")) return "scatter";
	if (normalized.includes("pie") || normalized.includes("donut")) return "pie";
	if (normalized.includes("tree")) return "treemap";
	if (normalized.includes("heat")) return "heatmap";
	if (normalized.includes("box")) return "boxplot";
	if (normalized.includes("hist")) return "histogram";
	if (normalized.includes("area")) return "area";
	if (normalized.includes("bar") || normalized.includes("column")) return "bar";
	if (normalized.includes("line") || normalized.includes("timeline") || normalized.includes("spline")) return "line";

	return undefined;
}

/**
 * Retrieves the chart type description, checking custom developer overrides first,
 * then falling back to predefined descriptions (with i18n support if available).
 *
 * @param {GetChartTypeDescriptionParams} params - The parameters for retrieving chart type description.
 * @returns {string} The chart type description.
 */
export function getChartTypeDescription({
	type,
	chartTypeDescription,
	chartTypeDescriptions,
	t,
}: GetChartTypeDescriptionParams): string {
	// 1. Direct custom string override
	if (typeof chartTypeDescription === "string" && chartTypeDescription.trim().length > 0) {
		return chartTypeDescription.trim();
	}

	// 2. Custom dictionary override
	const customDicts = [
		typeof chartTypeDescription === "object" && chartTypeDescription !== null ? chartTypeDescription : undefined,
		chartTypeDescriptions,
	];

	for (const dict of customDicts) {
		if (dict && typeof dict === "object") {
			if (dict[type]) return dict[type];
			const normalized = type ? type.toLowerCase().trim() : "";
			if (dict[normalized]) return dict[normalized];
			const category = resolveChartCategory(type);
			if (category && dict[category]) return dict[category];
		}
	}

	// 3. Predefined descriptions
	const category = resolveChartCategory(type);
	if (category) {
		if (t) {
			const translationKey = `chart_type_${category}`;
			const translated = t(translationKey);
			if (translated && translated !== translationKey) {
				return translated;
			}
		}
		if (DEFAULT_CHART_TYPE_DESCRIPTIONS[category]) {
			return DEFAULT_CHART_TYPE_DESCRIPTIONS[category];
		}
	}

	// 4. Fallback for unknown chart type
	if (t) {
		const unknownKey = "chart_type_unknown";
		const translatedUnknown = t(unknownKey, { type: type || "unknown" });
		if (translatedUnknown && translatedUnknown !== unknownKey) {
			return translatedUnknown;
		}
	}

	return `No description available for ${type || "this"} chart.`;
}
