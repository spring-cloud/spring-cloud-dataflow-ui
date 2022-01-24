declare namespace Cypress {
  interface Chainable {
    checkVisibility(selector: string): void
    checkExistence(selector: string): void
    launchBatchSampleTask(): void
    registerApplication(): void
    createBatchTask(): void
    importStreams(): void
    checkLoading(): void
    importTasks(): void
    createTask(): void
    launchTask(): void
  }
}

Cypress.Commands.add('checkVisibility', (selector: string) => {
  cy.get(selector).should('be.visible')
})

Cypress.Commands.add('checkExistence', (selector: string) => {
  cy.get(selector).should('be.exist')
})

Cypress.Commands.add('checkLoading', () => {
  cy.get('clr-spinner').should('be.visible')
  cy.get('clr-spinner').should('not.exist')
})

Cypress.Commands.add('importStreams', () => {
  cy.get('button#btnAddApplications').click()
  cy.get('[value="stream.kafka.docker"] + label').click()
  cy.get('button[type=submit]').click()
  cy.checkExistence('app-apps-list')
  cy.checkExistence('.apps-total')
})

Cypress.Commands.add('registerApplication', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click()
  cy.get('button#btnAddApplications').click()
  cy.get('button.clr-accordion-header-button').first().click()
  cy.get('input[name = "name0"]').type('billrun')
  cy.get('select[name = "type0"]').select('4')
  cy.get('input[name = "uri0"]').type('maven://org.springframework.cloud:spring-cloud-dataflow-single-step-batch-job:2.9.0-SNAPSHOT')
  cy.get('button[name = "register"]').click()
  cy.checkExistence('app-apps-list')
  cy.checkExistence('.apps-total')
})

Cypress.Commands.add('importTasks', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click()
  cy.checkExistence('button#btnAddApplications')
  cy.get('button#btnAddApplications').click()
  cy.get('[value="task.docker"] + label').click()
  cy.get('button[type=submit]').click()
})

Cypress.Commands.add('createTask', () => {
  cy.get('button.btn-primary').first().click()
  cy.checkExistence('pre.CodeMirror-line')
  cy.get('.CodeMirror-line').type('timestamp')
  cy.get('button.btn-primary').first().click()
  cy.get('input[name = "name"]').type('Test'+new Date().getTime())
  cy.get('input[name = "desc"]').type('Test task description')
  cy.get('button[type = "submit"]').click()
})

Cypress.Commands.add('createBatchTask', () => {
  cy.get('button.btn-primary').first().click()
  cy.checkExistence('pre.CodeMirror-line')
  cy.get('.CodeMirror-line').type('billrun')
  cy.get('button.btn-primary').first().click()
  cy.get('input[name = "name"]').type('JobTask'+new Date().getTime())
  cy.get('input[name = "desc"]').type('Test task description')
  cy.get('button[type = "submit"]').click()
})

Cypress.Commands.add('launchTask', () => {
  cy.checkExistence('.datagrid-action-toggle')
  cy.get('.datagrid-action-toggle').last().click()
  cy.get('.datagrid-action-overflow button:nth-child(2)').click()
  cy.get('app-task-launch-builder').should('be.visible')
  cy.checkExistence('button#btn-deploy-builder')
  cy.get('button#btn-deploy-builder').click()
})

Cypress.Commands.add('launchBatchSampleTask', () => {
  cy.get('.content-area').scrollTo('bottom')
  cy.checkVisibility('.datagrid-footer')
  cy.checkVisibility('button.pagination-last')
  cy.get('button.pagination-last').click()
  cy.checkExistence('.datagrid-action-toggle')
  cy.get('.datagrid-action-toggle').last().click()
  cy.get('.datagrid-action-overflow button:nth-child(2)').click()
  cy.checkExistence('button#btn-deploy-builder')
  cy.get('button#btn-deploy-builder').click()
})
