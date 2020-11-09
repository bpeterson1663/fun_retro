describe('Auth', () => {
    describe('Login Functionality', () => {
        beforeEach(() => cy.visit('/login'))

        it('should login in when correct email and password are provided',() => {
            cy.login('stage@test.com', 'Test1ng23!')
            cy.location('pathname').should('include', 'retroList')
            cy.logout()
            cy.location('pathname').should('include', 'login')
        })
        it('should not log in due to wrong password', () => {
            cy.login('stage@test.com', 'wrongpassword!')
            cy.getBySel('snackbar_message')
                .should('be.visible')
            cy.location('pathname').should('not.include', 'retroList')
        })
        it('should not log in due to no email existing', () => {
            cy.login('wrongemail@email.com', 'wrongpassword')
            cy.getBySel('snackbar_message')
                .should('be.visible')
            cy.getBySel('snackbar_content').should('have.css','background-color', 'rgb(211, 47, 47)')
        })
    })
    describe('Sign Up Functionality', () => {
        beforeEach(() => {
            cy.visit('/signup')
        })
        it('should signup a new user successfully', () => {
            let idToken
            cy.server()
            cy.route('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser*`)
                .as('signup')
            cy.getBySel('signup_email').find('input').type('stage6@test.com')
            cy.getBySel('signup_password').find('input').type('testing123')
            cy.getBySel('signup_confirm-password').find('input').type('testing123')
            cy.getBySel('signup_submit').click()
            cy.wait('@signup')
                .then((xhr) => {
                    idToken = xhr.response.body.idToken
                    cy.location('pathname').should('include', '/retroList')
                    cy.getBySel('admin_container').should('be.visible')
                    cy.logout()
                    cy.deleteUser(idToken)
                })
        })
        it('should not create a new user successfully if user exists', () => {
            cy.getBySel('signup_email').find('input').type('stage@test.com')
            cy.getBySel('signup_password').find('input').type('testing123')
            cy.getBySel('signup_confirm-password').find('input').type('testing123')
            cy.getBySel('signup_submit').click()
            cy.getBySel('snackbar_message')
                .should('be.visible')
            cy.getBySel('snackbar_content').should('have.css', 'background-color', 'rgb(211, 47, 47)')
        })
    })
    describe('Retro Id Exists On Log In', () => {
        it('should redirect to retro if id exists after successful login', () => {
            cy.visit('/retro/TTnSJO9dYbVJdw2tWjUI')
            cy.login('stage@test.com', 'Test1ng23!')

            cy.location('pathname').should('include', '/retro/TTnSJO9dYbVJdw2tWjUI')
            cy.getBySel('sign_out')
                .click()
        })
        it('should redirect if id exists on sign up for new user', () => {
            let idToken
            cy.server()
            cy.visit('/retro/TTnSJO9dYbVJdw2tWjUI')
            cy.route('POST', `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser*`)
                .as('signup')
            cy.getBySel('signup_from_login')
                .click() 
            cy.getBySel('signup_email').find('input').type('stage6@test.com')
            cy.getBySel('signup_password').find('input').type('testing123')
            cy.getBySel('signup_confirm-password').find('input').type('testing123')
            cy.getBySel('signup_submit').click()
            cy.wait('@signup')
                .then((xhr) => {
                    idToken = xhr.response.body.idToken
                    cy.location('pathname').should('include', '/retro/TTnSJO9dYbVJdw2tWjUI')
                    cy.getBySel('retro_container').should('be.visible')
                    cy.getBySel('sign_out')
                        .click()
                    cy.deleteUser(idToken)
                })
        })
    })
})