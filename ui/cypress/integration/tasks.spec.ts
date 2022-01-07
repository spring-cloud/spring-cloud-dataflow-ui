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
    cy.get('.datagrid-action-overflow button').first().click()
    cy.checkVisibility('app-view-card')
    cy.get('app-view-card').should('have.id','info')
  })

  it('Launch selected task', () => {
    cy.launchTask()
    cy.get('app-view-card').invoke('attr', 'keycontext').should('eq','execution')
  })

  it('Destroy selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
    cy.checkVisibility('.modal-dialog button')
    cy.get('.modal-dialog button').last().click()
  })

  it('Clone selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(5)').first().click()
    cy.checkVisibility('.modal-dialog button')
    cy.get('.modal-dialog button').last().click()
  })

  it('Cleanup selected task', () => {
    cy.launchTask()
    cy.get('button:nth-child(3)').last().click()
    cy.checkVisibility('button')
    cy.get('button').last().click()
    cy.get('.modal-dialog button:nth-child(2)').first().click()
  })

  describe('Tasks executions validation', () => {

    beforeEach(() => {
      cy.get('a[routerlink = "tasks-jobs/task-executions"]').click()
    })

    it('View details on task execution', () => {
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkVisibility('.datagrid-action-overflow')
      cy.get('.datagrid-action-overflow button:nth-child(1)').first().click()
    })

    it('View task detail on task execution', () => {
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkVisibility('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(2)').first().click()
    })

    it('Relaunch task execution', () => {
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkVisibility('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(3)').first().click()
    })

    it('Stop task execution', () => {
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkVisibility('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
      cy.checkVisibility('.modal-dialog button')
      cy.get('.modal-dialog button:nth-child(2)').last().click()
    })

    it('Cleanup task execution', () => {
      cy.get('.datagrid-action-toggle').last().click()
      cy.get('.datagrid-action-overflow button:nth-child(5)').first().click()
      cy.checkVisibility('button.close')
      cy.get('button.close').click()
    })

    it('Group action for cleaning up tasks execution', () => {
      cy.get('.tasks-execution-total').then($appTotal => {
        cy.get('button.btn-secondary').first().click()
        cy.get('input[type="checkbox"] + label').first().click()
        cy.get('button.btn-outline-danger').first().click()
        cy.checkVisibility('.modal #btn-stop')
        cy.get('.modal #btn-stop').click()
        cy.checkVisibility('.tasks-execution-total')
        cy.get('.tasks-execution-total').then($appUpdatedTotal => {
          expect(Number($appUpdatedTotal.text())).to.eq(0)
        })
      })
    })

  })

})
