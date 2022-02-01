describe('Tasks validation', () => {

  const goToTasksJobs = () => {
    cy.checkVisibility('a[routerlink = "tasks-jobs/tasks"]')
    cy.get('a[routerlink = "tasks-jobs/tasks"]').first().click()
  }

  before(()=> {
    cy.visit(Cypress.config('baseUrl'))
    cy.get('clr-vertical-nav-group[appfeature = "tasks"]').click()
    cy.importTasks()
  })

  beforeEach(() => {
    goToTasksJobs()
    cy.get('clr-spinner').should('not.exist')
    cy.createTask()
  })

  it('Create a task and render it on table', () => {
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('View details for selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button').first().click()
    cy.checkExistence('app-view-card')
    cy.get('app-view-card').should('have.id','info')
  })

  it('Launch selected task', () => {
    cy.launchTask()
    cy.checkLoadingDone()
    cy.get('app-view-card').invoke('attr', 'keycontext').should('eq','execution')
  })

  it('Destroy selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
    cy.checkExistence('.modal-dialog button')
    cy.get('.modal-dialog button').last().click()
  })

  it('Clone selected task', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(5)').first().click()
    cy.checkExistence('.modal-dialog button')
    cy.get('.modal-dialog button').last().click()
  })

  it('Cleanup selected task', () => {
    cy.launchTask()
    goToTasksJobs()
    cy.checkVisibility('.datagrid-action-toggle')
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(6)').first().click()
    cy.checkExistence('.modal-dialog')
    cy.checkExistence('.modal-dialog #btn-stop')
    cy.get('.modal-dialog #btn-stop').click()
  })

  describe('Tasks executions validation', () => {

    beforeEach(() => {
      cy.launchTask()
      cy.checkVisibility('a[routerlink = "tasks-jobs/task-executions"]')
      cy.get('a[routerlink = "tasks-jobs/task-executions"]').click()
    })

    it('View details on task execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow')
      cy.get('.datagrid-action-overflow button:nth-child(1)').first().click()
    })

    it('View task detail on task execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(2)').first().click()
    })

    it('Relaunch task execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(3)').first().click()
    })

    it('Group action for cleaning up tasks execution', () => {
      cy.get('.tasks-execution-total').then($appTotal => {
        cy.get('button.btn-secondary').first().click()
        cy.get('input[type="checkbox"] + label').first().click()
        cy.get('button.btn-outline-danger').first().click()
        cy.checkExistence('.modal #btn-stop')
        cy.get('.modal #btn-stop').click()
        cy.get('app-toast').should('be.visible')
        cy.checkExistence('.tasks-execution-total')
        cy.get('clr-spinner').should('not.exist')
        cy.get('.tasks-execution-total').then($appUpdatedTotal => {
          expect(Number($appUpdatedTotal.text())).to.eq(0)
        })
      })
    })

    it('Stop task execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
      cy.checkExistence('.modal-dialog button')
      cy.get('.modal-dialog button:nth-child(2)').first().click()
    })

    it('Cleanup task execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.get('.datagrid-action-overflow button:nth-child(5)').first().click()
      cy.checkExistence('button.close')
      cy.get('button.close').click()
    })

  })

  describe('Jobs executions validation', () => {

    before(() => {
      goToTasksJobs()
      cy.cleanupTasks()
      // cy.registerApplication()
      goToTasksJobs()
      cy.createBatchTask()
      cy.launchBatchSampleTask()

    })

    beforeEach(() => {
      cy.get('a[routerlink = "tasks-jobs/job-executions"]').click()
    })

    it('View execution details on selected job', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow')
      cy.get('.datagrid-action-overflow button:nth-child(1)').first().click()
    })

    it('Stop job execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(2)').first().click()
    })

    it('Restart job execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(3)').first().click()
    })

    it('Group action for cleaning up job execution', () => {
      cy.get('.tasks-execution-total').then($appTotal => {
        cy.get('button.btn-secondary').first().click()
        cy.get('input[type="checkbox"] + label').first().click()
        cy.get('button.btn-outline-danger').first().click()
        cy.checkExistence('.modal #btn-stop')
        cy.get('.modal #btn-stop').click()
        cy.get('app-toast').should('be.visible')
        cy.checkExistence('.tasks-execution-total')
        cy.checkLoadingDone()
        cy.get('.tasks-execution-total').then($appUpdatedTotal => {
          expect(Number($appUpdatedTotal.text())).to.eq(0)
        })
      })
    })

    it('Stop job execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
      cy.checkExistence('.modal-dialog button')
      cy.get('.modal-dialog button:nth-child(2)').last().click()
    })

    it('Cleanup job execution', () => {
      cy.checkVisibility('.datagrid-action-toggle')
      cy.get('.datagrid-action-toggle').last().click()
      cy.get('.datagrid-action-overflow button:nth-child(5)').first().click()
      cy.checkExistence('button.close')
      cy.get('button.close').click()
    })

  })

})
