describe("Retro", () => {
    beforeEach(() => {
        cy.visit('/retro/ygqdHDzAooGv549Qwt6E')
        cy.login('stage@test.com', 'Test1ng23!')

    })
    afterEach(() => cy.logout())
    it('should add item', () => {
        cy.getBySel('retro_container').should('be.visible')
        cy.getBySel('column-liked').should('be.visible');
        cy.getBySel('column-liked-textfield').should('be.visible').type("Testing Item Creation")
        cy.getBySel('column-liked-addButton').click()
        cy.getBySel('column-liked-item0').should('contain', 'Testing Item Creation')
    })
})