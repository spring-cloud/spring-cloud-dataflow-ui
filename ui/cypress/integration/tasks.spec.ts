describe('Tasks area', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('clr-vertical-nav-group[appfeature = "tasks"]').click()
    cy.get('a[routerlink = "tasks-jobs/tasks"]').first().click()
  })

  it('Test created tasks rendered on table effectively', () => {
    cy.createTasks()
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('Test unregister for selected task', () => {
    cy.createTasks()
    cy.wait(1200)
    cy.get('.tasks-total').then($tasksTotal => {
      const initialTasks = $tasksTotal.text();
      cy.get('.datagrid-action-toggle').last().click()
      cy.wait(1200)
      cy.get('.datagrid-action-overflow button').last().click()
      cy.wait(3000)
      cy.get('.modal-dialog button').last().click()
      cy.get('.apps-total').then($tasksUpdatedTotal => {
        expect(Number($tasksUpdatedTotal.text())).to.eq(Number(initialTasks) - 1)
      })
    })
  })
})
