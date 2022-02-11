declare namespace Cypress {
  interface Chainable {
    apps(): void;
    streams(): void;
    tasks(): void;
    taskExecutions(): void;
    jobExecutions(): void;
    schedules(): void;
    auditRecords(): void;
    tools(): void;
  }
}

Cypress.Commands.add('apps', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navApplications]').click();
  cy.get('clr-spinner').should('not.exist');
});

Cypress.Commands.add('streams', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navStreams]').click();
  cy.get('clr-spinner').should('not.exist');
});

Cypress.Commands.add('tasks', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navTasks]').click();
  cy.get('clr-spinner').should('not.exist');
});

Cypress.Commands.add('taskExecutions', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navTaskExecutions]').click();
  cy.get('clr-spinner').should('not.exist');
});

Cypress.Commands.add('jobExecutions', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navJobExecutions]').click();
  cy.get('clr-spinner').should('not.exist');
});

Cypress.Commands.add('schedules', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navSchedules]').click();
  cy.get('clr-spinner').should('not.exist');
});

Cypress.Commands.add('auditRecords', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navAuditRecords]').click();
  cy.get('clr-spinner').should('not.exist');
});

Cypress.Commands.add('tools', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navTools]').click();
  cy.get('clr-spinner').should('not.exist');
});
