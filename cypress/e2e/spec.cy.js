describe('Login and Logout Test', () => {
  beforeEach(() => {
    cy.visit('https://norofffeu.github.io/social-media-client/');
  });

  it('should log in with valid credentials', () => {
    cy.get('#loginEmail').type('validUser@noroff.no', { force: true });
    cy.get('#loginPassword').type('validPassword', { force: true });
    cy.get('#loginForm').submit({ force: true });
  });

  it('should log out successfully', () => {
    cy.get('button[data-auth="logout"]').click({ force: true });

    cy.url().should('eq', 'https://norofffeu.github.io/social-media-client/'); 
  });
});

describe('Login with invalid credentials', () => {
  beforeEach(() => {
    cy.visit('https://norofffeu.github.io/social-media-client/');
  });

  it('should not log in with invalid credentials and show an error message', () => {
    cy.get('#loginEmail').type('123@hotmil.no', { force: true });
    cy.get('#loginPassword').type('whei', { force: true });
    cy.get('#loginForm').submit({ force: true });

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Either your username was not found or your password is incorrect'); 
    });
  });
});