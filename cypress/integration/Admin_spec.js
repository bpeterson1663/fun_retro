describe('Admin Functionality', () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.login('stage@test.com', 'Test1ng23!');
    });
    it('should create new retro', () => {
        cy.getBySel('admin_create-retro').click();
        cy.getBySel('create_dialog').should('be.visible');
        cy.getBySel('retro_type').click()
        cy.getBySel('retro_type-mad').click()
        cy.get('[name="retro_name"]')
            .type('New Retro')
        cy.get('[name="retro_vote"]')
            .type(8)
        cy.get('[name="retro_start"]')
            .type('2019-08-01')
        cy.get('[name="retro_end"]')
            .type('2019-08-01')
        cy.getBySel('admin_submit-retro')
            .click();
        cy.getBySel('snackbar_content').should('have.css','background-color', 'rgb(67, 160, 71)');
    });
    it('should delete retro and warning message should be shown', () => {
        cy.getBySel('admin_delete-retro-button').first().click();
        cy.getBySel('delete-warning_dialog').should('be.visible');
        cy.getBySel('cancel-delete_button').click();
        cy.getBySel('delete-warning_dialog').should('not.be.visible');

        cy.getBySel('admin_delete-retro-button').first().click();
        cy.getBySel('delete-warning_dialog').should('be.visible');
        cy.getBySel('confirm-delete_button').click();
        cy.getBySel('snackbar_content').should('have.css','background-color', 'rgb(67, 160, 71)');
    }) 
});