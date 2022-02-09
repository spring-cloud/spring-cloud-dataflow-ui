declare namespace Cypress {
  interface Chainable {
    registerApplication(): void;
    unregisterApplications(): void;
    checkToastAnimation(): void;
    createBatchTask(name?: string, dsl?: string, desc?: string): void;
    importStreams(): void;
    destroyStreams(): void;
    createStream(name?: string, dsl?: string, desc?: string): void;
    cleanupTaskExecutions(): void;
    importAppsTask(): void;
    createTask(name?: string, dsl?: string, desc?: string): void;
    destroyTasks(): void;
    launchTask(name: string): void;
  }
}

Cypress.Commands.add('checkToastAnimation', () => {
  cy.get('app-toast div').should('be.visible');
  cy.get('app-toast div').should('not.be.visible');
});

Cypress.Commands.add('importStreams', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click();
  cy.get('button#btnAddApplications').click();
  cy.get('[value="stream.kafka.docker"] + label').click();
  cy.get('button[type=submit]').click();
  cy.checkToastAnimation();
  cy.get('app-apps-list').should('be.exist');
  cy.get('span.pagination-total').should('be.exist');
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
  cy.checkToastAnimation();
  cy.get('app-apps-list').should('be.exist');
  cy.get('span.pagination-total').should('be.exist');
});

Cypress.Commands.add('unregisterApplications', () => {
  cy.apps();
  cy.get('span.pagination-total').then(total => {
    if (Number(total.text()) > 0) {
      cy.get('button[data-cy="groupActions"]').click();
      cy.get('input[type="checkbox"] + label').first().click();
      cy.get('button[data-cy="unregisterApplications"]').click();
      cy.get('button[data-cy="unregister"]').should('be.exist');
      cy.get('button[data-cy="unregister"]').click();
      cy.checkToastAnimation();
      cy.get('.content-area').scrollTo('bottom', {ensureScrollable: false});
      cy.get('clr-spinner').should('not.exist');
      cy.unregisterApplications();
    }
  });
});

Cypress.Commands.add('importAppsTask', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click();
  cy.get('button#btnAddApplications').should('be.exist');
  cy.get('button#btnAddApplications').click();
  cy.get('[value="task.maven"] + label').click();
  cy.get('button[type=submit]').click();
  cy.checkToastAnimation();
  cy.get('span.pagination-total').should('be.exist');
});

Cypress.Commands.add('createTask', (name?: string, dsl?: string, desc?: string) => {
  cy.get('button[data-cy=createTask]').click();
  cy.get('pre.CodeMirror-line').should('be.exist');
  cy.get('.CodeMirror-line').type(dsl ? dsl : 'timestamp');
  cy.get('button.btn-primary').first().click();
  cy.get('input[name = "name"]').type(name ? name : 'T' + Cypress._.uniqueId(Date.now().toString()));
  if (desc) {
    cy.get('input[name = "desc"]').type(desc);
  }
  cy.get('button[data-cy=submit]').click();
  cy.checkToastAnimation();
  cy.get('span.pagination-total').should('be.exist');
});

Cypress.Commands.add('createStream', (name?: string, dsl?: string, desc?: string) => {
  cy.get('button[data-cy="createStream"]').first().click();
  cy.get('pre.CodeMirror-line').should('be.exist');
  cy.get('.CodeMirror-line').type(dsl ? dsl : 'file|filter|log');
  cy.wait(500).then(() => {
    cy.get('button[data-cy=createStream]').first().click();
    cy.get('input[name = "0"]').type(name ? name : 'S' + Cypress._.uniqueId(Date.now().toString()));
    if (desc) {
      cy.get('input[name = "0_desc"]').type(desc);
    }
    cy.wait(500).then(() => {
      cy.get('button[data-cy=submit]').click();
      cy.checkToastAnimation();
    });
  });
});

Cypress.Commands.add('destroyStreams', () => {
  cy.streams();
  cy.get('span.pagination-total').then(total => {
    if (Number(total.text()) > 0) {
      cy.get('button[data-cy="groupActions"]').click();
      cy.get('input[type="checkbox"] + label').first().click();
      cy.get('button[data-cy="destroyStreams"]').click();
      cy.get('button[data-cy="destroy"]').should('be.exist');
      cy.get('button[data-cy="destroy"]').click();
      cy.checkToastAnimation();
      cy.get('.content-area').scrollTo('bottom', {ensureScrollable: false});
      cy.get('clr-spinner').should('not.exist');
      cy.destroyStreams();
    }
  });
});

Cypress.Commands.add('createBatchTask', (name?: string, dsl?: string, desc?: string) => {
  cy.get('button.btn-primary').first().click();
  cy.get('pre.CodeMirror-line').should('be.exist');
  cy.get('.CodeMirror-line').click().type('timestamp-batch');
  cy.get('button[data-cy=createTask]').first().click();
  cy.get('input[name = "name"]').type(name ? name : 'J' + Cypress._.uniqueId(Date.now().toString()));
  if (desc) {
    cy.get('input[name = "desc"]').type(desc);
  }
  cy.get('button[data-cy=submit]').click();
  cy.checkToastAnimation();
});

Cypress.Commands.add('launchTask', (name: string) => {
  cy.visit(Cypress.config('baseUrl') + '#/tasks-jobs/tasks/' + name + '/launch');
  cy.get('app-task-launch-builder').should('be.visible');
  cy.get('button#btn-deploy-builder').should('be.exist');
  cy.get('button#btn-deploy-builder').click();
  cy.checkToastAnimation();
});

Cypress.Commands.add('destroyTasks', () => {
  cy.tasks();
  cy.get('span.pagination-total').then(total => {
    if (Number(total.text()) > 0) {
      cy.get('button[data-cy="groupActions"]').click();
      cy.get('input[type="checkbox"] + label').first().click();
      cy.get('button[data-cy="destroyTasks"]').click();
      cy.get('button[data-cy="destroy"]').should('be.exist');
      cy.get('button[data-cy="destroy"]').click();
      cy.checkToastAnimation();
      cy.get('.content-area').scrollTo('bottom', {ensureScrollable: false});
      cy.get('clr-spinner').should('not.exist');
      cy.destroyTasks();
    }
  });
});

Cypress.Commands.add('cleanupTaskExecutions', () => {
  cy.taskExecutions();
  cy.get('span.pagination-total').then(total => {
    if (Number(total.text()) > 0) {
      cy.get('button[data-cy="groupActions"]').click();
      cy.get('input[type="checkbox"] + label').first().click();
      cy.get('button[data-cy="cleanupExecutions"]').click();
      cy.get('button[data-cy="cleanup"]').should('be.exist');
      cy.get('button[data-cy="cleanup"]').click();
      cy.checkToastAnimation();
      cy.get('.content-area').scrollTo('bottom', {ensureScrollable: false});
      cy.get('clr-spinner').should('not.exist');
      cy.cleanupTaskExecutions();
    }
  });
});
