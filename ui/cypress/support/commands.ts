declare namespace Cypress {
  interface Chainable {
    shouldShowToast(title?: string, desc?: string): void;
    // Applications
    registerApplication(): void;
    unregisterApplications(): void;
    importAppsStream(): void;
    importAppsTask(): void;
    // Streams
    createStream(name?: string, dsl?: string, desc?: string): void;
    destroyStreams(): void;
    createTask(name?: string, dsl?: string, desc?: string): void;
    // Tasks
    destroyTasks(): void;
    launchTask(name: string): void;
    cleanupTaskExecutions(): void;
  }
}

Cypress.Commands.add('shouldShowToast', (title?: string, desc?: string) => {
  cy.get('app-toast div').should('be.visible');
  if (title || desc) {
    cy.get('app-toast div').then(text => {
      if (title) {
        expect(text.first().text()).contains(title);
      }
      if (desc) {
        expect(text.last().text()).contains(desc);
      }
    });
  }
  cy.get('app-toast div').should('not.be.visible');
});

Cypress.Commands.add('importAppsStream', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click();
  cy.get('button#btnAddApplications').click();
  cy.get('[value="stream.rabbitmq.maven"] + label').click();
  cy.get('button[type=submit]').click();
  cy.shouldShowToast('Import starters', 'Application(s) Imported.');
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
  cy.shouldShowToast('Register application(s).', '1 App(s) registered');
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
      cy.shouldShowToast();
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
  cy.shouldShowToast();
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
  cy.shouldShowToast('Task creation', `Task Definition created for ${name}`);
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
      cy.shouldShowToast('Stream(s) creation', 'Stream(s) have been created successfully');
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
      cy.shouldShowToast();
      cy.get('.content-area').scrollTo('bottom', {ensureScrollable: false});
      cy.get('clr-spinner').should('not.exist');
      cy.destroyStreams();
    }
  });
});

Cypress.Commands.add('launchTask', (name: string) => {
  cy.visit(Cypress.config('baseUrl') + '#/tasks-jobs/tasks/' + name + '/launch');
  cy.get('app-task-launch-builder').should('be.visible');
  cy.get('button#btn-deploy-builder').should('be.exist');
  cy.get('button#btn-deploy-builder').click();
  cy.shouldShowToast('Launch success', `Successfully launched task definition "${name}"`);
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
      cy.shouldShowToast();
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
      cy.shouldShowToast();
      cy.get('.content-area').scrollTo('bottom', {ensureScrollable: false});
      cy.get('clr-spinner').should('not.exist');
      cy.cleanupTaskExecutions();
    }
  });
});
