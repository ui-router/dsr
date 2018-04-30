describe('example app', () => {
  it('loads', () => {
    cy.visit('');
  });

  it('renders links', () => {
    cy.visit('/');
    cy.get('a').contains('about');
    cy.get('a').contains('continentlist');
  });

  it('renders about by default', () => {
    cy.visit('/');
    cy.contains('This is a trivial Deep State Redirect example app');
  });

  it('can navigate to continentlist', () => {
    cy.visit('');
    cy
      .get('a')
      .contains('continentlist')
      .click();

    cy.contains('Africa');
    cy.contains('America');
    cy.contains('Oceania');
  });

  it('can navigate to belize', () => {
    cy.visit('');
    cy
      .get('a')
      .contains('continentlist')
      .click();
    cy
      .get('a')
      .contains('America')
      .click();
    cy
      .get('a')
      .contains('Belize')
      .click();
    cy.get('h3').contains('Belize');
  });

  it('can navigate to belize and back', () => {
    cy.visit('');
    cy
      .get('a')
      .contains('continentlist')
      .click();
    cy
      .get('a')
      .contains('America')
      .click();
    cy.url().should('include', '/America');

    cy
      .get('a')
      .contains('Belize')
      .click();
    cy.get('h3').contains('Belize');
    cy.url().should('include', '/America/Belize');

    cy
      .get('a')
      .contains('about')
      .click();
    cy.contains('This is a trivial Deep State Redirect example app');
  });

  it('dsr sends you back to belize', () => {
    cy.visit('');
    cy
      .get('a')
      .contains('continentlist')
      .click();
    cy
      .get('a')
      .contains('America')
      .click();
    cy.url().should('include', '/America');

    cy
      .get('a')
      .contains('Belize')
      .click();
    cy.url().should('include', '/America/Belize');
    cy.get('h3').contains('Belize');

    cy
      .get('a')
      .contains('about')
      .click();
    cy.url().should('include', '/about');
    cy.contains('This is a trivial Deep State Redirect example app');

    cy
      .get('a')
      .contains('continentlist')
      .click();
    cy.url().should('include', '/America/Belize');
    cy.get('h3').contains('Belize');
  });
});
