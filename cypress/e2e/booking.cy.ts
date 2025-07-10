describe("Booking Flow", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("lets a user search and book a service", () => {
        // Search for a service
        cy.get("input[placeholder*='Search']").type("Premium");

        // Should see service results
        cy.contains("Premium Detail").should("be.visible");

        // Click on a service
        cy.contains("Premium Detail").click();

        // Should be on service detail page
        cy.url().should("include", "/services/");

        // Click book now
        cy.contains("Book Now").click();

        // Fill booking form
        cy.get("input[name='name']").type("Test User");
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='phone']").type("123-456-7890");
        cy.get("input[name='date']").type("2025-01-15");
        cy.get("input[name='time']").type("10:00");
        cy.get("input[name='zipCode']").type("12345");

        // Submit booking
        cy.contains("Confirm Booking").click();

        // Should be on thank you page
        cy.url().should("include", "/thank-you");
        cy.contains("Thank You").should("be.visible");
    });

    it("shows validation errors for missing fields", () => {
        // Go to booking form
        cy.visit("/");
        cy.contains("Book Now").first().click();

        // Try to submit without filling required fields
        cy.contains("Confirm Booking").click();

        // Should show validation errors
        cy.contains("required").should("be.visible");
    });

    it("navigates through the app successfully", () => {
        // Test navigation
        cy.contains("Home").click();
        cy.url().should("eq", Cypress.config().baseUrl + "/");

        // Test sign in page
        cy.visit("/signin");
        cy.contains("Sign In").should("be.visible");

        // Test sign up page
        cy.visit("/signup");
        cy.contains("Sign Up").should("be.visible");
    });
}); 