describe('Tasks/Jobs', () => {
  before(() => {
    // Open dashboard UI and import Apps
    cy.visit(Cypress.config('baseUrl'));
    cy.importAppsTask();
  });

  after(() => {
    // Clean up all executions
    cy.taskExecutions();
    cy.get('button[data-cy="groupActions"]').click();
    cy.get('input[type="checkbox"] + label').first().click();
    cy.get('button[data-cy="cleanupExecutions"]').click();
    cy.get('button[data-cy="cleanup"]').should('be.exist');
    cy.get('button[data-cy="cleanup"]').click();
    // Destroy all tasks
    cy.tasks();
    cy.get('button[data-cy="groupActions"]').click();
    cy.get('input[type="checkbox"] + label').first().click();
    cy.get('button[data-cy="destroyTasks"]').click();
    cy.get('button[data-cy="destroy"]').should('be.exist');
    cy.get('button[data-cy="destroy"]').click();
  });

  describe('Tasks', () => {
    beforeEach(() => {
      cy.tasks();
    });

    it('should create 3 tasks', () => {
      cy.createTask('task1');
      cy.createTask('task2');
      cy.createTask('task3');
      cy.get('.tasks-total').should(elem => {
        expect(Number(elem.text())).to.equal(3);
      });
    });

    it('should show the task details', () => {
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button').first().click();
      cy.checkExistence('app-view-card');
      cy.get('app-view-card').should('have.id', 'info');
    });

    it('should launch a task', () => {
      cy.launchTask('task1');
      cy.checkLoadingDone();
      cy.get('app-view-card').invoke('attr', 'keycontext').should('eq', 'execution');
    });

    it('should destroy a task', () => {
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button:nth-child(4)').first().click();
      cy.checkExistence('.modal-dialog button');
      cy.get('.modal-dialog button').last().click();
      cy.get('.tasks-total').should(elem => {
        expect(Number(elem.text())).to.equal(2);
      });
    });

    it('should cleanup a task', () => {
      cy.launchTask('task2');
      cy.tasks();
      cy.checkVisibility('.datagrid-action-toggle');
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button:nth-child(6)').first().click();
      cy.checkExistence('.modal-dialog');
      cy.get('button[data-cy=cleanup').click();
      // TODO: check state
    });

    it('should clone a task', () => {
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button:nth-child(5)').first().click();
      cy.checkExistence('.modal-dialog button');
      cy.get('.modal-dialog button').last().click();
      cy.get('.tasks-total').should(elem => {
        expect(Number(elem.text())).to.equal(3);
      });
    });
  });

  describe('Task executions', () => {
    beforeEach(() => {
      cy.launchTask('task1');
      cy.checkVisibility('a[routerlink = "tasks-jobs/task-executions"]');
      cy.get('a[routerlink = "tasks-jobs/task-executions"]').click();
    });

    it('Should show a task execution', () => {
      cy.checkVisibility('.datagrid-action-toggle');
      cy.get('.datagrid-action-toggle').last().click();
      cy.checkExistence('.datagrid-action-overflow');
      cy.get('.datagrid-action-overflow button:nth-child(1)').first().click();
      // TODO: check state
    });

    it('Should navigate to the task', () => {
      cy.checkVisibility('.datagrid-action-toggle');
      cy.get('.datagrid-action-toggle').last().click();
      cy.checkExistence('.datagrid-action-overflow button');
      cy.get('.datagrid-action-overflow button:nth-child(2)').first().click();
      // TODO: check state
    });

    it('Should relaunch the task', () => {
      cy.checkVisibility('.datagrid-action-toggle');
      cy.get('.datagrid-action-toggle').last().click();
      cy.checkExistence('.datagrid-action-overflow button');
      cy.get('.datagrid-action-overflow button:nth-child(3)').first().click();
      // TODO: check state
    });

    it('should clean up task executions', () => {
      cy.get('.tasks-execution-total').then($appTotal => {
        cy.get('button.btn-secondary').first().click();
        cy.get('input[type="checkbox"] + label').first().click();
        cy.get('button.btn-outline-danger').first().click();
        cy.checkExistence('.modal #btn-stop');
        cy.get('.modal #btn-stop').click();
        cy.get('app-toast').should('be.visible');
        cy.checkExistence('.tasks-execution-total');
        cy.get('clr-spinner').should('not.exist');
        cy.get('.tasks-execution-total').then($appUpdatedTotal => {
          expect(Number($appUpdatedTotal.text())).to.eq(0);
        });
      });
    });

    it('Should cleanup a task execution', () => {
      cy.checkVisibility('.datagrid-action-toggle');
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button:nth-child(5)').first().click();
      cy.checkExistence('button.close');
      cy.get('button.close').click();
      // TODO: check state
    });
  });

  describe('Job executions', () => {
    before(() => {
      cy.tasks();
      cy.cleanupTasks();
      cy.tasks();
    });

    it('Should create and launch a task job', () => {
      cy.createBatchTask('job-sample');
      cy.launchTask('job-sample');
      cy.wait(10 * 1000);
      // TODO: check state
    });

    it('Should show the details of a job execution', () => {
      cy.jobExecutions();
      cy.checkVisibility('.datagrid-action-toggle');
      cy.get('.datagrid-action-toggle').last().click();
      cy.checkExistence('.datagrid-action-overflow');
      cy.get('.datagrid-action-overflow button').first().click();
      // TODO: check state
    });
  });
});
