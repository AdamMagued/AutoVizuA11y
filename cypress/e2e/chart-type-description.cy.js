/* eslint-disable no-undef */
describe("(Alt + T) Chart Type Description Test", () => {
	it("should announce the predefined chart type description through the alert live region", () => {
		cy.visit("/");
		cy.injectAxe();
		cy.findByTestId("manual-descriptions-option").click();
		cy.wait(500); // Wait for AutoVizuA11y to handle descriptions
		cy.findAllByTestId("a11y_desc").first().focus().type("{alt}t");
		cy.findAllByTestId("a11y-chart-alert")
			.first()
			.should("contain.text", "bar chart");
		cy.checkA11y();
	});
});
