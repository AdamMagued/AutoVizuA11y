/* eslint-disable no-undef */
describe("(Arrow keys) Navigate Inside Shortcut Guide Test", () => {
	it("should navigate between shortcut rows using arrow keys", () => {
		cy.visit("/");
		cy.injectAxe();
		cy.findByTestId("manual-descriptions-option").click();
		cy.wait(500); // AutoVizuA11y waits 500ms before handling descriptions
		cy.findAllByTestId("a11y_desc").first().focus().type("?");
		cy.findAllByTestId("a11y-native-shortcut-guide").first().should("be.visible");

		// Focus the first row
		cy.get(".shortcut-guide__row").first().as("firstRow").focus();
		cy.get("@firstRow").should("be.focused");

		// Down arrow navigates to the next row
		cy.get("@firstRow").type("{downArrow}");
		cy.get(".shortcut-guide__row").eq(1).as("secondRow").should("be.focused");

		// Up arrow navigates back to the previous row
		cy.get("@secondRow").type("{upArrow}");
		cy.get("@firstRow").should("be.focused");

		// Right arrow navigates to the next row
		cy.get("@firstRow").type("{rightArrow}");
		cy.get("@secondRow").should("be.focused");

		// Left arrow navigates back to the previous row
		cy.get("@secondRow").type("{leftArrow}");
		cy.get("@firstRow").should("be.focused");

		cy.checkA11y();
	});
});
