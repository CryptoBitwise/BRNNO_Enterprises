describe("Authentication", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("allows user to sign up", () => {
        cy.visit("/signup");

        // Fill sign up form
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type("password123");
        cy.get("input[name='confirmPassword']").type("password123");

        // Submit form
        cy.contains("Sign Up").click();

        // Should redirect to home or show success
        cy.url().should("not.include", "/signup");
    });

    it("allows user to sign in", () => {
        cy.visit("/signin");

        // Fill sign in form
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type("password123");

        // Submit form
        cy.contains("Sign In").click();

        // Should redirect to home or show success
        cy.url().should("not.include", "/signin");
    });

    it("shows validation errors for invalid email", () => {
        cy.visit("/signup");

        // Try invalid email
        cy.get("input[name='email']").type("invalid-email");
        cy.get("input[name='password']").type("password123");

        // Submit form
        cy.contains("Sign Up").click();

        // Should show validation error
        cy.contains("valid email").should("be.visible");
    });

    it("shows validation errors for password mismatch", () => {
        cy.visit("/signup");

        // Fill form with mismatched passwords
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type("password123");
        cy.get("input[name='confirmPassword']").type("different");

        // Submit form
        cy.contains("Sign Up").click();

        // Should show validation error
        cy.contains("match").should("be.visible");
    });
}); 