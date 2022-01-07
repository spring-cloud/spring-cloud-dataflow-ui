describe('Tasks validation', () => {

  before(()=> {
    cy.visit('/')
    cy.get('clr-vertical-nav-group[appfeature = "tasks"]').click()
    cy.importTasks()
  })

  beforeEach(() => {
    cy.get('a[routerlink = "tasks-jobs/tasks"]').first().click()
    cy.createTask()
  })

  it('Create a task and render it on table', () => {
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('View details for selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button').last().click()
    cy.wait(1200)
    cy.get('app-view-card').should('have.id','info')
  })

  it('Launch selected task', () => {
    cy.launchTask()
    cy.get('app-view-card').invoke('attr', 'keycontext').should('eq','execution')
  })

  it('Destroy selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
    cy.wait(1200)
    cy.get('.modal-dialog button').last().click()
  })

  it('Clone selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(5)').first().click()
    cy.wait(1200)
    cy.get('.modal-dialog button').last().click()
  })

  it('Cleanup selected task', () => {
    cy.launchTask()
    cy.get('button:nth-child(3)').click()
    cy.get('button').last().click()
    cy.get('.modal-dialog button:nth-child(2)').first().click()
  })

  describe('Tasks executions validation', () => {

    beforeEach(() => {
      cy.get('a[routerlink = "tasks-jobs/task-executions"]').click()
      cy.wait(1500)
    })

    it('View details on task execution', () => {
      cy.get('.datagrid-action-toggle').first().click()
      cy.wait(1200)
      cy.get('.datagrid-action-overflow button:nth-child(1)').first().click()
    })

    it('View task detail on task execution', () => {
      cy.get('.datagrid-action-toggle').first().click()
      cy.wait(1200)
      cy.get('.datagrid-action-overflow button:nth-child(2)').first().click()
    })

    it('Relaunch task execution', () => {
      cy.get('.datagrid-action-toggle').first().click()
      cy.wait(1200)
      cy.get('.datagrid-action-overflow button:nth-child(3)').first().click()
    })

    it('Stop task execution', () => {
      cy.get('.datagrid-action-toggle').first().click()
      cy.wait(1200)
      cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
      cy.wait(1200)
      cy.get('.modal-dialog button:nth-child(2)').last().click()
    })

    it('Cleanup task execution', () => {
      cy.get('.datagrid-action-toggle').first().click()
      cy.wait(1200)
      cy.get('.datagrid-action-overflow button:nth-child(5)').first().click()
    })

    it('Group action for cleaning up tasks execution', () => {
      cy.get('.tasks-execution-total').then($appTotal => {
        cy.get('button.btn-secondary').first().click()
        cy.get('input[type="checkbox"] + label').first().click()
        cy.get('button.btn-outline-danger').first().click()
        cy.get('.modal #btn-stop').click()
        cy.get('.apps-total').then($appUpdatedTotal => {
          expect(Number($appUpdatedTotal.text())).to.eq(0)
        })
      })
    })

  })

})
