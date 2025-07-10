/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to login with test user
             * @example cy.login()
             */
            login(): Chainable<void>;

            /**
             * Custom command to create a test booking
             * @example cy.createBooking()
             */
            createBooking(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('login', () => {
    // Mock login for testing
    cy.window().then((win) => {
        win.localStorage.setItem('authUser', JSON.stringify({
            uid: 'test-user-id',
            email: 'test@example.com'
        }));
    });
});

Cypress.Commands.add('createBooking', () => {
    cy.request({
        method: 'POST',
        url: '/api/book',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
        },
        body: {
            serviceTitle: 'Premium Detail',
            name: 'Test User',
            email: 'test@example.com',
            phone: '123-456-7890',
            date: '2025-01-15',
            time: '10:00',
            zipCode: '12345'
        }
    });
});

export { }; 