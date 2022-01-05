Cypress.Commands.add('importStreams', () => {
  cy.get('button#btnAddApplications').click()
  cy.get('[value="stream.kafka.docker"] + label').click()
  cy.get('button[type=submit]').click()
})

Cypress.Commands.add('importTasks', () => {
  cy.get('.nav-content > a[routerlink = "apps"]').click()
  cy.get('button#btnAddApplications').click()
  cy.get('[value="task.docker"] + label').click()
  cy.get('button[type=submit]').click()
})

Cypress.Commands.add('createTask', () => {
  cy.get('button.btn-primary').first().click()
  cy.get('pre.CodeMirror-line').type('timestamp')
  cy.get('button.btn-primary').first().click()
  cy.get('input[name = "name"]').type('Test'+new Date().getTime())
  cy.get('input[name = "desc"]').type('Test task description')
  cy.get('button[type = "submit"]').click()
})

Cypress.Commands.add('launchTask', () => {
  cy.get('.datagrid-action-toggle').first().click()
    cy.wait(1200)
    cy.get('.datagrid-action-overflow button:nth-child(2)').click()
    cy.wait(1200)
    cy.get('button#btn-deploy-builder').click()
    cy.wait(1200)
})
