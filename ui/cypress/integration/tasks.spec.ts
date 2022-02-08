describe('Tasks/Jobs', () => {
  before(() => {
    // Open dashboard UI and import Apps
    cy.visit(Cypress.config('baseUrl'));
    cy.importAppsTask();
  });

  after(() => {
    // Clean up all executions
    cy.cleanupTaskExecutions();
    // Destroy all tasks
    cy.destroyTasks();
  });

  describe('Tasks', () => {
    beforeEach(() => {
      cy.tasks();
    });

    it('should create 3 tasks', () => {
      cy.createTask('task1');
      cy.createTask('task2');
      cy.createTask('task3');
      cy.get('span[data-cy="totalTasks"]').should(elem => {
        expect(Number(elem.text())).to.equal(3);
      });
    });

    it('should show the task details', () => {
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button').first().click();
      cy.get('app-view-card').should('be.exist');
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
      cy.get('.modal-dialog button').should('be.exist');
      cy.get('.modal-dialog button').last().click();
      cy.get('span[data-cy="totalTasks"]').should(elem => {
        expect(Number(elem.text())).to.equal(2);
      });
    });

    it('should cleanup a task', () => {
      cy.launchTask('task2');
      cy.tasks();
      cy.get('.datagrid-action-toggle').should('be.visible');
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button:nth-child(6)').first().click();
      cy.get('.modal-dialog').should('be.exist');
      cy.get('button[data-cy=cleanup').click();
      // TODO: check state
    });

    it('should clone a task', () => {
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button:nth-child(5)').first().click();
      cy.get('.modal-dialog button').should('be.exist');
      cy.get('.modal-dialog button').last().click();
      cy.get('span[data-cy="totalTasks"]').should(elem => {
        expect(Number(elem.text())).to.equal(3);
      });
    });
  });

  describe('Task executions', () => {
    beforeEach(() => {
      cy.launchTask('task1');
      cy.get('a[routerlink = "tasks-jobs/task-executions"]').should('be.visible');
      cy.get('a[routerlink = "tasks-jobs/task-executions"]').click();
    });

    it('Should show a task execution', () => {
      cy.get('.datagrid-action-toggle').should('be.visible');
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow').should('be.exist');
      cy.get('.datagrid-action-overflow button:nth-child(1)').first().click();
      // TODO: check state
    });

    it('Should navigate to the task', () => {
      cy.get('.datagrid-action-toggle').should('be.visible');
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button').should('be.exist');
      cy.get('.datagrid-action-overflow button:nth-child(2)').first().click();
      // TODO: check state
    });

    it('Should relaunch the task', () => {
      cy.get('.datagrid-action-toggle').should('be.visible');
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button').should('be.exist');
      cy.get('.datagrid-action-overflow button:nth-child(3)').first().click();
      // TODO: check state
    });

    it('should clean up task executions', () => {
      cy.get('span[data-cy="totalTaskExecutions"]').then(total => {
        expect(Number(total.text())).to.gt(0);
        cy.get('button[data-cy="groupActions"]').click();
        cy.get('input[type="checkbox"] + label').first().click();
        cy.get('button[data-cy="cleanupExecutions"]').click();
        cy.get('button[data-cy="cleanup"]').should('be.exist');
        cy.get('button[data-cy="cleanup"]').click();
        cy.get('app-toast').should('be.visible');
        cy.get('span[data-cy="totalTaskExecutions"]').should('be.exist');
        cy.get('clr-spinner').should('not.exist');
        cy.get('span[data-cy="totalTaskExecutions"]').then(totalUpdated => {
          expect(Number(totalUpdated.text())).to.eq(0);
        });
      });
    });

    it('Should cleanup a task execution', () => {
      cy.get('.datagrid-action-toggle').should('be.visible');
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow button:nth-child(5)').first().click();
      cy.get('button.close').should('be.exist');
      cy.get('button.close').click();
      // TODO: check state
    });
  });

  describe('Job executions', () => {
    before(() => {
      cy.tasks();
      cy.cleanupTaskExecutions();
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
      cy.get('.datagrid-action-toggle').should('be.visible');
      cy.get('.datagrid-action-toggle').last().click();
      cy.get('.datagrid-action-overflow').should('be.exist');
      cy.get('.datagrid-action-overflow button').first().click();
      // TODO: check state
    });
  });
});
