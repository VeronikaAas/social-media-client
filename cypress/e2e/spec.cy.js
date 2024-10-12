describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/'); // Besøk rot-url, som kan være innloggingssiden
  });

  it('should log in with valid credentials', () => {
    cy.get('input[name="email"]').type('validEmail@example.com'); 
    cy.get('input[name="password"]').type('validPassword'); 
    cy.get('button[type="submit"]').click(); 

    // Forvent at brukeren blir omdirigert til dashboardet
    cy.url().should('include', '/dashboard'); // Sjekker at URL-en inneholder '/dashboard'
  });

  it('should not submit with invalid credentials and show an error message', () => {
    cy.get('input[name="email"]').type('invalidEmail@example.com');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button[type="submit"]').click();

    // Forvent at en feilmelding vises
    cy.contains('Invalid credentials').should('be.visible'); 
  });

  it('should log out with the logout button', () => {
    // Logg inn først
    cy.get('input[name="email"]').type('validEmail@example.com');
    cy.get('input[name="password"]').type('validPassword');
    cy.get('button[type="submit"]').click();

    // Klikk på logg ut
    cy.get('button#logout').click(); // Anta at det er en knapp med ID 'logout'

    // Forvent at brukeren blir omdirigert til innloggingssiden igjen
    cy.url().should('include', '/login'); // Sjekker at URL-en inneholder '/login'
  });
});