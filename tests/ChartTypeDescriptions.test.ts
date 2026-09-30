/**
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 * Other licensing options may be available, please reach out to data-viz@feedzai.com for more information.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import {
	getChartTypeDescription,
	resolveChartCategory,
	DEFAULT_CHART_TYPE_DESCRIPTIONS,
} from "../src/components/descriptions/ChartTypeDescriptions";
import { descriptionsKeyHandler } from "../src/components/descriptions/DescriptionsKeyHandler";
import { handleKeyDown } from "../src/utils/handleKeyDown";
import type { TFunction } from "i18next";

describe("ChartTypeDescriptions Unit Tests", () => {
	describe("resolveChartCategory", () => {
		it("correctly identifies bar chart variations", () => {
			assert.strictEqual(resolveChartCategory("bar"), "bar");
			assert.strictEqual(resolveChartCategory("Bar chart"), "bar");
			assert.strictEqual(resolveChartCategory("BAR CHART"), "bar");
			assert.strictEqual(resolveChartCategory("stacked bar"), "bar");
			assert.strictEqual(resolveChartCategory("horizontal bar chart"), "bar");
			assert.strictEqual(resolveChartCategory("column chart"), "bar");
		});

		it("correctly identifies line chart variations", () => {
			assert.strictEqual(resolveChartCategory("line"), "line");
			assert.strictEqual(resolveChartCategory("Line chart"), "line");
			assert.strictEqual(resolveChartCategory("Single line chart"), "line");
			assert.strictEqual(resolveChartCategory("Multi line chart"), "line");
			assert.strictEqual(resolveChartCategory("timeline"), "line");
			assert.strictEqual(resolveChartCategory("spline chart"), "line");
		});

		it("correctly identifies pie and donut charts", () => {
			assert.strictEqual(resolveChartCategory("pie"), "pie");
			assert.strictEqual(resolveChartCategory("Pie chart"), "pie");
			assert.strictEqual(resolveChartCategory("donut"), "pie");
			assert.strictEqual(resolveChartCategory("donut chart"), "pie");
		});

		it("correctly identifies scatter plots", () => {
			assert.strictEqual(resolveChartCategory("scatter"), "scatter");
			assert.strictEqual(resolveChartCategory("Scatterplot"), "scatter");
			assert.strictEqual(resolveChartCategory("scatter plot"), "scatter");
			assert.strictEqual(resolveChartCategory("scatter-plot"), "scatter");
		});

		it("correctly identifies treemaps", () => {
			assert.strictEqual(resolveChartCategory("treemap"), "treemap");
			assert.strictEqual(resolveChartCategory("Tree map"), "treemap");
			assert.strictEqual(resolveChartCategory("tree-map"), "treemap");
		});

		it("correctly identifies heatmaps", () => {
			assert.strictEqual(resolveChartCategory("heatmap"), "heatmap");
			assert.strictEqual(resolveChartCategory("Heat map"), "heatmap");
			assert.strictEqual(resolveChartCategory("heat-map"), "heatmap");
		});

		it("correctly identifies area charts", () => {
			assert.strictEqual(resolveChartCategory("area"), "area");
			assert.strictEqual(resolveChartCategory("Area chart"), "area");
			assert.strictEqual(resolveChartCategory("stacked area"), "area");
		});

		it("correctly identifies histograms", () => {
			assert.strictEqual(resolveChartCategory("histogram"), "histogram");
			assert.strictEqual(resolveChartCategory("Histogram chart"), "histogram");
		});

		it("correctly identifies box plots", () => {
			assert.strictEqual(resolveChartCategory("boxplot"), "boxplot");
			assert.strictEqual(resolveChartCategory("Box plot"), "boxplot");
			assert.strictEqual(resolveChartCategory("box-and-whisker"), "boxplot");
		});

		it("returns undefined for unknown or empty chart types", () => {
			assert.strictEqual(resolveChartCategory("unknown-chart"), undefined);
			assert.strictEqual(resolveChartCategory(""), undefined);
			// @ts-expect-error test invalid types
			assert.strictEqual(resolveChartCategory(null), undefined);
			// @ts-expect-error test invalid types
			assert.strictEqual(resolveChartCategory(undefined), undefined);
		});
	});

	describe("Predefined description retrieval for various chart types", () => {
		it("retrieves predefined description for bar chart", () => {
			const desc = getChartTypeDescription({ type: "Bar chart" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.bar);
			assert.ok(desc.toLowerCase().includes("bars"));
		});

		it("retrieves predefined description for line chart", () => {
			const desc = getChartTypeDescription({ type: "Single line chart" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.line);
			assert.ok(desc.toLowerCase().includes("line"));
		});

		it("retrieves predefined description for pie chart", () => {
			const desc = getChartTypeDescription({ type: "Pie chart" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.pie);
			assert.ok(desc.toLowerCase().includes("slices"));
		});

		it("retrieves predefined description for scatterplot", () => {
			const desc = getChartTypeDescription({ type: "Scatterplot" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.scatter);
			assert.ok(desc.toLowerCase().includes("dots"));
		});

		it("retrieves predefined description for treemap", () => {
			const desc = getChartTypeDescription({ type: "Tree map" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.treemap);
			assert.ok(desc.toLowerCase().includes("nested rectangles"));
		});

		it("retrieves predefined description for heatmap", () => {
			const desc = getChartTypeDescription({ type: "Heatmap" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.heatmap);
			assert.ok(desc.toLowerCase().includes("color scale") || desc.toLowerCase().includes("colour scale"));
		});

		it("retrieves predefined description for area chart", () => {
			const desc = getChartTypeDescription({ type: "Area chart" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.area);
			assert.ok(desc.toLowerCase().includes("area"));
		});

		it("retrieves predefined description for histogram", () => {
			const desc = getChartTypeDescription({ type: "Histogram" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.histogram);
			assert.ok(desc.toLowerCase().includes("bins"));
		});

		it("retrieves predefined description for box plot", () => {
			const desc = getChartTypeDescription({ type: "Box plot" });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.boxplot);
			assert.ok(desc.toLowerCase().includes("quartiles"));
		});

		it("returns a clean fallback description for unknown chart type", () => {
			const desc = getChartTypeDescription({ type: "radar" });
			assert.strictEqual(desc, "No description available for radar chart.");
		});

		it("supports internationalization via translation function", () => {
			const mockT: TFunction<"translation", undefined> = ((key: string) => {
				const ptTranslations: Record<string, string> = {
					chart_type_bar: "Um gráfico de barras usa barras retangulares.",
					chart_type_line: "Um gráfico de linhas apresenta pontos de dados ligados.",
					chart_type_pie: "Um gráfico circular é um gráfico estatístico.",
				};
				return ptTranslations[key] ?? key;
			}) as unknown as TFunction<"translation", undefined>;

			const barDesc = getChartTypeDescription({ type: "bar chart", t: mockT });
			assert.strictEqual(barDesc, "Um gráfico de barras usa barras retangulares.");

			const lineDesc = getChartTypeDescription({ type: "line chart", t: mockT });
			assert.strictEqual(lineDesc, "Um gráfico de linhas apresenta pontos de dados ligados.");
		});

		it("falls back to default English description when translation key is missing in t", () => {
			const mockT: TFunction<"translation", undefined> = ((key: string) => key) as unknown as TFunction<"translation", undefined>;
			const desc = getChartTypeDescription({ type: "bar chart", t: mockT });
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.bar);
		});
	});

	describe("Developer override and custom description support", () => {
		it("overrides description using custom string in chartTypeDescription", () => {
			const customDesc = "Custom bar chart description for quarterly sales.";
			const desc = getChartTypeDescription({
				type: "Bar chart",
				chartTypeDescription: customDesc,
			});
			assert.strictEqual(desc, customDesc);
		});

		it("overrides description using custom dictionary in chartTypeDescription", () => {
			const customMap = {
				bar: "Custom bar explanation.",
				line: "Custom line explanation.",
			};
			const barDesc = getChartTypeDescription({
				type: "Bar chart",
				chartTypeDescription: customMap,
			});
			assert.strictEqual(barDesc, "Custom bar explanation.");

			const lineDesc = getChartTypeDescription({
				type: "Single line chart",
				chartTypeDescription: customMap,
			});
			assert.strictEqual(lineDesc, "Custom line explanation.");
		});

		it("overrides description using chartTypeDescriptions prop", () => {
			const customDescriptions = {
				radar: "A radar chart visualizes multiple quantitative variables across axes.",
				"bar chart": "Custom bar chart text.",
			};
			const radarDesc = getChartTypeDescription({
				type: "radar",
				chartTypeDescriptions: customDescriptions,
			});
			assert.strictEqual(
				radarDesc,
				"A radar chart visualizes multiple quantitative variables across axes.",
			);

			const barDesc = getChartTypeDescription({
				type: "bar chart",
				chartTypeDescriptions: customDescriptions,
			});
			assert.strictEqual(barDesc, "Custom bar chart text.");
		});

		it("prioritizes string override over dictionary and default", () => {
			const desc = getChartTypeDescription({
				type: "Bar chart",
				chartTypeDescription: "Priority string description",
				chartTypeDescriptions: {
					bar: "Dictionary bar description",
				},
			});
			assert.strictEqual(desc, "Priority string description");
		});

		it("falls back to predefined description when key is not in custom dictionary", () => {
			const desc = getChartTypeDescription({
				type: "Bar chart",
				chartTypeDescriptions: {
					pie: "Custom pie only",
				},
			});
			assert.strictEqual(desc, DEFAULT_CHART_TYPE_DESCRIPTIONS.bar);
		});
	});

	describe("Shortcut trigger and live region announcement", () => {
		it("announces chart type description when Alt + T is pressed", () => {
			let prevented = false;
			const fakeEvent = {
				altKey: true,
				code: "KeyT",
				preventDefault: () => {
					prevented = true;
				},
			} as unknown as React.KeyboardEvent;

			const alertElement = { textContent: "" } as unknown as HTMLElement;
			const alertDivRef = { current: alertElement } as React.RefObject<HTMLElement>;
			const chartElement = {} as HTMLElement;
			const chartRef = { current: chartElement } as React.RefObject<HTMLElement>;
			let descriptionContent = "";

			descriptionsKeyHandler({
				chartRef,
				setDescriptionContent: (c: string) => {
					descriptionContent = c;
				},
				type: "Bar chart",
				descs: ["Long description", "Short description"],
				title: "Revenue Chart",
				alertDivRef,
				event: fakeEvent,
			});

			assert.strictEqual(prevented, true);
			assert.strictEqual(alertElement.textContent, DEFAULT_CHART_TYPE_DESCRIPTIONS.bar);
			// descriptionContent for a11y_desc should remain untouched by Alt+T
			assert.strictEqual(descriptionContent, "");
		});

		it("announces chart type description when Alt + C is pressed", () => {
			let prevented = false;
			const fakeEvent = {
				altKey: true,
				code: "KeyC",
				preventDefault: () => {
					prevented = true;
				},
			} as unknown as React.KeyboardEvent;

			const alertElement = { textContent: "" } as unknown as HTMLElement;
			const alertDivRef = { current: alertElement } as React.RefObject<HTMLElement>;
			const chartElement = {} as HTMLElement;
			const chartRef = { current: chartElement } as React.RefObject<HTMLElement>;

			descriptionsKeyHandler({
				chartRef,
				setDescriptionContent: () => {},
				type: "Scatterplot",
				descs: ["Long", "Short"],
				title: "Distribution",
				alertDivRef,
				event: fakeEvent,
			});

			assert.strictEqual(prevented, true);
			assert.strictEqual(alertElement.textContent, DEFAULT_CHART_TYPE_DESCRIPTIONS.scatter);
		});

		it("announces custom developer override when Alt + T is pressed", () => {
			const fakeEvent = {
				altKey: true,
				code: "KeyT",
				preventDefault: () => {},
			} as unknown as React.KeyboardEvent;

			const alertElement = { textContent: "" } as unknown as HTMLElement;
			const alertDivRef = { current: alertElement } as React.RefObject<HTMLElement>;
			const chartRef = { current: {} as HTMLElement } as React.RefObject<HTMLElement>;

			descriptionsKeyHandler({
				chartRef,
				setDescriptionContent: () => {},
				type: "Bar chart",
				descs: ["Long", "Short"],
				title: "Sales",
				alertDivRef,
				chartTypeDescription: "Custom bar chart for sales team.",
				event: fakeEvent,
			});

			assert.strictEqual(alertElement.textContent, "Custom bar chart for sales team.");
		});

		it("announces custom dictionary override when Alt + T is pressed", () => {
			const fakeEvent = {
				altKey: true,
				code: "KeyT",
				preventDefault: () => {},
			} as unknown as React.KeyboardEvent;

			const alertElement = { textContent: "" } as unknown as HTMLElement;
			const alertDivRef = { current: alertElement } as React.RefObject<HTMLElement>;
			const chartRef = { current: {} as HTMLElement } as React.RefObject<HTMLElement>;

			descriptionsKeyHandler({
				chartRef,
				setDescriptionContent: () => {},
				type: "radar",
				descs: ["Long", "Short"],
				title: "Performance",
				alertDivRef,
				chartTypeDescriptions: {
					radar: "Custom radar explanation.",
				},
				event: fakeEvent,
			});

			assert.strictEqual(alertElement.textContent, "Custom radar explanation.");
		});

		it("does not announce or prevent default when Alt is not pressed", () => {
			let prevented = false;
			const fakeEvent = {
				altKey: false,
				code: "KeyT",
				preventDefault: () => {
					prevented = true;
				},
			} as unknown as React.KeyboardEvent;

			const alertElement = { textContent: "initial" } as unknown as HTMLElement;
			const alertDivRef = { current: alertElement } as React.RefObject<HTMLElement>;
			const chartRef = { current: {} as HTMLElement } as React.RefObject<HTMLElement>;

			descriptionsKeyHandler({
				chartRef,
				setDescriptionContent: () => {},
				type: "Bar chart",
				descs: ["Long", "Short"],
				title: "Sales",
				alertDivRef,
				event: fakeEvent,
			});

			assert.strictEqual(prevented, false);
			assert.strictEqual(alertElement.textContent, "initial");
		});

		it("does not announce when shortcut guide is open", () => {
			let prevented = false;
			const fakeEvent = {
				altKey: true,
				code: "KeyT",
				preventDefault: () => {
					prevented = true;
				},
			} as unknown as React.KeyboardEvent;

			const alertElement = { textContent: "initial" } as unknown as HTMLElement;
			const alertDivRef = { current: alertElement } as React.RefObject<HTMLElement>;
			const chartRef = { current: {} as HTMLElement } as React.RefObject<HTMLElement>;

			descriptionsKeyHandler({
				chartRef,
				setDescriptionContent: () => {},
				type: "Bar chart",
				descs: ["Long", "Short"],
				title: "Sales",
				alertDivRef,
				isShortcutGuideOpen: true,
				event: fakeEvent,
			});

			assert.strictEqual(prevented, true);
			assert.strictEqual(alertElement.textContent, "initial");
		});

		it("works in full handleKeyDown keyboard event dispatch", async () => {
			const fakeNativeEvent = {
				altKey: true,
				code: "KeyT",
				key: "t",
				preventDefault: () => {},
			};
			const fakeEvent = {
				nativeEvent: fakeNativeEvent,
				preventDefault: () => {},
			} as unknown as React.KeyboardEvent<HTMLDivElement>;

			const alertElement = { textContent: "" } as unknown as HTMLElement;
			const alertDivRef = { current: alertElement } as React.RefObject<HTMLElement>;
			const chartElement = {
				getElementsByClassName: () => [],
			} as unknown as HTMLDivElement;
			const chartRef = { current: chartElement } as React.RefObject<HTMLDivElement>;

			await handleKeyDown(fakeEvent, {
				alertDivRef,
				type: "Pie chart",
				number: 1,
				chartRef,
				elements: [],
				selectedSeries: "",
				series: [],
				selectorType: { element: "path" },
				setSelectedSeries: () => {},
				setNumber: () => {},
				setDescriptionContent: () => {},
				insights: "",
				insightsArray: [],
				arrayConverted: [],
				title: "Market Share",
				descs: ["Long desc", "Short desc"],
				isShortcutGuideOpen: false,
				setIsShortcutGuideOpen: () => {},
				shortcutGuideRef: { current: {} as HTMLDialogElement },
				t: ((k: string) => k) as unknown as TFunction<"translation", undefined>,
			});

			assert.strictEqual(alertElement.textContent, DEFAULT_CHART_TYPE_DESCRIPTIONS.pie);
		});

		it("handles Alt+T with custom chartTypeDescription in handleKeyDown", async () => {
			const fakeNativeEvent = {
				altKey: true,
				code: "KeyT",
				key: "t",
				preventDefault: () => {},
			};
			const fakeEvent = {
				nativeEvent: fakeNativeEvent,
				preventDefault: () => {},
			} as unknown as React.KeyboardEvent<HTMLDivElement>;

			const alertElement = { textContent: "" } as unknown as HTMLElement;
			const alertDivRef = { current: alertElement } as React.RefObject<HTMLElement>;
			const chartElement = {
				getElementsByClassName: () => [],
			} as unknown as HTMLDivElement;
			const chartRef = { current: chartElement } as React.RefObject<HTMLDivElement>;

			await handleKeyDown(fakeEvent, {
				alertDivRef,
				type: "Bar chart",
				number: 1,
				chartRef,
				elements: [],
				selectedSeries: "",
				series: [],
				selectorType: { element: "rect" },
				setSelectedSeries: () => {},
				setNumber: () => {},
				setDescriptionContent: () => {},
				insights: "",
				insightsArray: [],
				arrayConverted: [],
				title: "Company Profits",
				descs: ["Long desc", "Short desc"],
				chartTypeDescription: "Custom bar description via handleKeyDown.",
				isShortcutGuideOpen: false,
				setIsShortcutGuideOpen: () => {},
				shortcutGuideRef: { current: {} as HTMLDialogElement },
				t: ((k: string) => k) as unknown as TFunction<"translation", undefined>,
			});

			assert.strictEqual(
				alertElement.textContent,
				"Custom bar description via handleKeyDown.",
			);
		});
	});
});
