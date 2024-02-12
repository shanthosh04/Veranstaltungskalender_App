describe('Event Operations', () => {
    it('successfully loads the home page', () => {
        cy.visit('http://localhost:3000/');
    });
});

describe("User Registration", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/register.html");
    });

    it('allows a user to register', () => {
        cy.get('input[name="firstname"]').type('shanthosh');
        cy.get('input[name="lastname"]').type('sivas');
        cy.get('input[name="birthdate"]').type('2004-10-16');
        cy.get('input[name="street"]').type('zieglerstrasse 67');
        cy.get('input[name="zipcode"]').type('3098');
        cy.get('input[name="city"]').type('koeniz');
        cy.get('input[name="email"]').type('shan@gmail.com');
        cy.get('input[name="password"]').type('cypress');
        cy.get('button[type="submit"]').click();

        cy.contains('Registration Successful').should('be.visible');
    });
});

describe('Login Operations', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login.html');
    });

    it('allows a user to login', () => {
        cy.get('input[name="email"]').type('shan@gmail.com');
        cy.get('input[name="password"]').type('cypress');
        cy.get('button[type="submit"]').click();
    });
});
