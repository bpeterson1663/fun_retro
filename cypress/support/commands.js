Cypress.Commands.add("getBySel", (selector, ...args) => {
    return cy.get(`[data-testid="${selector}"]`, ...args)
})

Cypress.Commands.add('login', (email, password) => {
    cy.server()

    cy.route('POST', 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword*').as('login')

    cy.get('[type="email"]')
        .type(email).should('have.value', email)
    cy.get('[type="password"]')
        .type(password).should('have.value', password)   
    cy.get('[type="submit"]')
        .click()

    cy.wait('@login')
})

Cypress.Commands.add('logout', () => {
    cy.server()

    cy.getBySel('sign_out')
        .click()

        cy.url().should('include', '/login')
})

Cypress.Commands.add('signup', (email, password) => {
    cy.get('[type="email"]')
        .type(email).should('have.value', email)
    cy.get('[type="password"]')
        .type(password).should('have.value', password)   
    cy.get('[type="submit"]')
        .click()
})

Cypress.Commands.add('deleteUser', idToken => {
    cy.request('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=AIzaSyCnT7wn4_E5nCIeuWYOkMKaEdThXy7Bwrg`, {idToken: idToken})
})