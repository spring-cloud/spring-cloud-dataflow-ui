describe('Tasks area', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('clr-vertical-nav-group[appfeature = "tasks"]').click()
  })

  it('Test created tasks rendered on table effectively', () => {
    cy.importTasks()
    cy.get('a[routerlink = "tasks-jobs/tasks"]').first().click()
    cy.createTasks()
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('Test view details for selected task', () => {
    cy.importTasks()
    cy.get('a[routerlink = "tasks-jobs/tasks"]').first().click()
    cy.createTasks()
    cy.wait(1200)
    cy.get('.tasks-total').then($tasksTotal => {
      const initialTasks = $tasksTotal.text();
      cy.get('.datagrid-action-toggle').last().click()
      cy.wait(1200)
      cy.get('.datagrid-action-overflow button').first().click()
      cy.wait(1200)
      cy.get('app-view-card').should('have.id','info')
    })
  })
})
