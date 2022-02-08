declare namespace Cypress {
  interface Chainable {
    apps(): void;
    appCreate(): void;
    streams(): void;
    streamCreate(): void;
    tasks(): void;
    taskCreate(): void;
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
});

Cypress.Commands.add('appCreate', () => {
  cy.apps();
  cy.get('button[data-cy=addApps]').click();
});

Cypress.Commands.add('streams', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navStreams]').click();
});

Cypress.Commands.add('streamCreate', () => {
  cy.streams();
  // TODO
});

Cypress.Commands.add('tasks', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navTasks]').click();
});

Cypress.Commands.add('taskCreate', () => {
  cy.tasks();
  // TODO
});

Cypress.Commands.add('taskExecutions', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navTaskExecutions]').click();
});

Cypress.Commands.add('jobExecutions', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navJoBExecutions]').click();
});

Cypress.Commands.add('schedules', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navSchedules]').click();
});

Cypress.Commands.add('jobExecutions', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navJoBExecutions]').click();
});

Cypress.Commands.add('auditRecords', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navAuditRecords]').click();
});

Cypress.Commands.add('tools', () => {
  cy.visit(Cypress.config('baseUrl'));
  cy.get('a[data-cy=navTools]').click();
});
