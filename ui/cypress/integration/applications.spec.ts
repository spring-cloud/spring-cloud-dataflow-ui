describe('Applications', () => {
  /**
   * Before hook
   * Setup the context, import stream applications
   */
  before(() => {
    cy.apps();
    cy.importStreams();
  });

  /**
   * After hook
   * Clean the context, unregister all the application
   */
  after(() => {
    cy.unregisterApplications();
  });

  /**
   * Before Each hook
   * Navigate to the applications list
   */
  beforeEach(() => {
    cy.apps();
  });

  it('should navigate to the application details', () => {
    cy.get('.datagrid-row-scrollable clr-dg-cell').should('be.visible');
    cy.get('.datagrid-row-scrollable clr-dg-cell a').first().click();
    cy.get('app-view-card').should('have.id', 'info');
  });

  it('should register 2 versions of an application', () => {
    cy.apps();
    cy.get('button[data-cy=addApps]').click();
    cy.get('clr-accordion-title[data-cy=register]').click();
    cy.get('input[name = "name0"]').type('aaaa');
    cy.get('select[name = "type0"]').select('source');
    cy.get('input[name = "uri0"]').type('maven://org.springframework.cloud.task.app:timestamp-task:2.1.1.RELEASE');
    cy.get('button[name = "register"]').click();
    cy.checkToastAnimation();
    cy.get('app-apps-list').should('be.exist');

    cy.apps();
    cy.get('button[data-cy=addApps]').click();
    cy.get('clr-accordion-title[data-cy=register]').click();
    cy.get('input[name = "name0"]').type('aaaa');
    cy.get('select[name = "type0"]').select('source');
    cy.get('input[name = "uri0"]').type('maven://org.springframework.cloud.task.app:timestamp-task:2.0.0.RELEASE');
    cy.get('button[name = "register"]').click();
    cy.checkToastAnimation();
    cy.get('app-apps-list').should('be.exist');
  });

  it('should change the default version', () => {
    cy.get('clr-dg-cell a')
      .contains('aaaa')
      .parentsUntil('clr-dg-row')
      .children('.datagrid-row-sticky')
      .first()
      .click();
    cy.get('div[role = "menu"]').should('be.exist');
    cy.get('div[role = "menu"] button:nth-child(2)').click();
    cy.get('.modal-title').contains('Manage versions');
    cy.get('button[data-cy="setDefault"]').first().click();
    cy.get('button[data-cy="confirmYes"]').click();
    cy.checkToastAnimation();
  });

  it('should unregister one version', () => {
    cy.get('clr-dg-cell a')
      .contains('aaaa')
      .parentsUntil('clr-dg-row')
      .children('.datagrid-row-sticky')
      .first()
      .click();
    cy.get('div[role = "menu"]').should('be.exist');
    cy.get('div[role = "menu"] button:nth-child(2)').click();
    cy.get('.modal-title').contains('Manage versions');
    cy.get('button[data-cy="unregister"]').last().click();
    cy.get('button[data-cy="confirmYes"]').click();
    cy.checkToastAnimation();
  });
});
