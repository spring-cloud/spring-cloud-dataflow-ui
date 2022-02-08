// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable {
    checkVisibility(selector: string): void;
    checkExistence(selector: string): void;
    registerApplication(): void;
    checkToastAnimation(): void;
    checkLoadingDone(): void;
    createBatchTask(name?: string, dsl?: string, desc?: string): void;
    importStreams(): void;
    createStream(name?: string, dsl?: string, desc?: string): void;
    cleanupTasks(): void;
    importAppsTask(): void;
    createTask(name?: string, dsl?: string, desc?: string): void;
    launchTask(name: string): void;
  }
}

Cypress.Commands.add('checkVisibility', (selector: string) => {
  cy.get(selector).should('be.visible');
});

Cypress.Commands.add('checkExistence', (selector: string) => {
  cy.get(selector).should('be.exist');
});

Cypress.Commands.add('checkLoadingDone', () => {
  cy.get('clr-spinner').should('be.visible');
  cy.get('clr-spinner').should('not.exist');
});

Cypress.Commands.add('checkToastAnimation', () => {
  cy.get('app-toast div').should('be.visible');
  cy.get('app-toast div').should('not.be.visible');
});

Cypress.Commands.add('importStreams', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click();
  cy.get('button#btnAddApplications').click();
  cy.get('[value="stream.kafka.docker"] + label').click();
  cy.get('button[type=submit]').click();
  cy.checkExistence('app-apps-list');
  cy.checkExistence('.apps-total');
});

Cypress.Commands.add('registerApplication', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click();
  cy.get('button#btnAddApplications').click();
  cy.get('button.clr-accordion-header-button').first().click();
  cy.get('input[name = "name0"]').type('billrun');
  cy.get('select[name = "type0"]').select('4');
  cy.get('input[name = "uri0"]').type(
    'maven://org.springframework.cloud:spring-cloud-dataflow-single-step-batch-job:2.9.0-SNAPSHOT'
  );
  cy.get('button[name = "register"]').click();
  cy.checkExistence('app-apps-list');
  cy.checkExistence('.apps-total');
});

Cypress.Commands.add('importAppsTask', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click();
  cy.checkExistence('button#btnAddApplications');
  cy.get('button#btnAddApplications').click();
  cy.get('[value="task.maven"] + label').click();
  cy.get('button[type=submit]').click();
});

Cypress.Commands.add('createTask', (name?: string, dsl?: string, desc?: string) => {
  cy.get('button[data-cy=createTask]').first().click();
  cy.checkExistence('pre.CodeMirror-line');
  cy.get('.CodeMirror-line').type(dsl ? dsl : 'timestamp');
  cy.get('button.btn-primary').first().click();
  cy.get('input[name = "name"]').type(name ? name : 'T' + Cypress._.uniqueId(Date.now().toString()));
  if (desc) {
    cy.get('input[name = "desc"]').type(desc);
  }
  cy.get('button[data-cy=submit]').click();
});

Cypress.Commands.add('createStream', (name?: string, dsl?: string, desc?: string) => {
  cy.get('button.btn-primary').first().click();
  cy.checkExistence('pre.CodeMirror-line');
  cy.get('.CodeMirror-line').type(dsl ? dsl : 'file|filter|log');
  cy.wait(500).then(() => {
    cy.get('button[data-cy=createStream]').first().click();
    cy.get('input[name = "0"]').type(name ? name : 'S' + Cypress._.uniqueId(Date.now().toString()));
    if (desc) {
      cy.get('input[name = "0_desc"]').type(desc);
    }
    cy.wait(500).then(() => {
      cy.get('button[data-cy=submit]').click();
    });
  });
});

Cypress.Commands.add('createBatchTask', (name?: string, dsl?: string, desc?: string) => {
  cy.get('button.btn-primary').first().click();
  cy.checkExistence('pre.CodeMirror-line');
  cy.get('.CodeMirror-line').click().type('timestamp-batch');
  cy.get('button[data-cy=createTask]').first().click();
  cy.get('input[name = "name"]').type(name ? name : 'J' + Cypress._.uniqueId(Date.now().toString()));
  if (desc) {
    cy.get('input[name = "desc"]').type(desc);
  }
  cy.get('button[data-cy=submit]').click();
});

Cypress.Commands.add('launchTask', (name: string) => {
  cy.visit(Cypress.config('baseUrl') + '#/tasks-jobs/tasks/' + name + '/launch');
  cy.get('app-task-launch-builder').should('be.visible');
  cy.checkExistence('button#btn-deploy-builder');
  cy.get('button#btn-deploy-builder').click();
});

Cypress.Commands.add('cleanupTasks', () => {
  cy.tasks();
  cy.get('.tasks-total').then(appTotal => {
    if (+appTotal > 0) {
      cy.get('clr-datagrid button.btn-secondary').first().click();
      cy.get('input[type="checkbox"] + label').first().click();
      cy.get('button.btn-outline-danger').first().click();
      cy.checkExistence('.modal button.btn-danger');
      cy.get('.modal button.btn-danger').click();
      cy.get('app-toast').should('be.visible');
      cy.get('.content-area').scrollTo('bottom', {ensureScrollable: false});
      cy.get('clr-spinner').should('not.exist');
      cy.cleanupTasks();
    }
  });
});
