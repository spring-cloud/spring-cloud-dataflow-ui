// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';

Cypress.Commands.add('addApplications',() => {
  cy.get('button#btnAddApplications').click()
  cy.get('[value="stream.kafka.docker"] + label').click()
  cy.get('button[type=submit]').click()
})

Cypress.Commands.add('createTasks',() => {
  cy.get('button.btn-primary').first().click()
  cy.get('pre.CodeMirror-line').type('time|filter|log')
  cy.get('button.btn-primary').first().click()
  cy.get('input[name = "name"]').type('Test')
  cy.get('input[name = "desc"]').type('Test task description')
  cy.get('button[type = "submit"]').click()
})
