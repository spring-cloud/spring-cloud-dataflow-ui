declare namespace Cypress {
  interface Chainable {
    checkExistence(selector: string): void
    checkVisibility(selector: string): void
    checkToastEnd(): void
    importStreams(): void
    importTasks(): void
    createTask(): void
    launchTask(): void
  }
}

Cypress.Commands.add('checkExistence', (selector: string) => {
  cy.get(selector).should('be.exist')
})

Cypress.Commands.add('checkVisibility', (selector: string) => {
  cy.get(selector).should('be.visible')
})

Cypress.Commands.add('checkToastEnd', () => {
  cy.get('#toast-container').its('length').should('gt', 0)
  cy.get('#toast-container').should('not.have.descendants')
})

Cypress.Commands.add('importStreams', () => {
  cy.get('button#btnAddApplications').click()
  cy.get('[value="stream.kafka.docker"] + label').click()
  cy.get('button[type=submit]').click()
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
  cy.get('pre.CodeMirror-line').type('timestamp')
  cy.get('button.btn-primary').first().click()
  cy.get('input[name = "name"]').type('Test'+new Date().getTime())
  cy.get('input[name = "desc"]').type('Test task description')
  cy.get('button[type = "submit"]').click()
})

Cypress.Commands.add('launchTask', () => {
  cy.get('.datagrid-action-toggle').first().click()
  cy.get('.datagrid-action-overflow button:nth-child(2)').click()
  cy.get('button#btn-deploy-builder').click()
})
