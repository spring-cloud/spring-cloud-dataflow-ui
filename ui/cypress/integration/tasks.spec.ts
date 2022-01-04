describe('Tasks area', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('clr-vertical-nav-group[appfeature = "tasks"]').click()
    cy.importTasks()
    cy.get('a[routerlink = "tasks-jobs/tasks"]').first().click()
    cy.createTasks()
    cy.wait(1200)
  })

  it('Test created tasks rendered on table effectively', () => {
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('Test view details for selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.wait(1200)
    cy.get('.datagrid-action-overflow button').first().click()
    cy.wait(1200)
    cy.get('app-view-card').should('have.id','info')
  })

  it('Test launch selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.wait(1200)
    cy.get('.datagrid-action-overflow button:nth-child(2)').click()
    cy.wait(1200)
    cy.get('button#btn-deploy-builder').click()
    cy.get('app-view-card').invoke('attr', 'keycontext').should('eq','execution')
  })

  it('Test destroy selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.wait(1200)
    cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
    cy.wait(1200)
    cy.get('.modal-dialog button').last().click()
  })

})
