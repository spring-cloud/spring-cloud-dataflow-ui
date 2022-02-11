describe('Streams', () => {
  /**
   * Before hook
   * Setup the context, import stream apps, create streams
   */
  before(() => {
    cy.apps();
    cy.importAppsStream();
  });

  /**
   * After hook
   * Clean the context, remove streams and apps
   */
  after(() => {
    cy.destroyStreams();
    cy.unregisterApplications();
  });

  /**
   * Before Each hook
   */
  beforeEach(() => {
    cy.streams();
  });

  it('should create 2 streams', () => {
    cy.createStream('bar');
    cy.createStream('foo');
    cy.get('span.pagination-total').should(elem => {
      expect(Number(elem.text())).to.equal(2);
    });
  });

  it('should navigate to the View details', () => {
    cy.get('.datagrid-action-toggle').first().click();
    cy.get('.datagrid-action-overflow button').first().click();
    cy.get('app-view-card').should('have.id', 'info');
  });

  it('should deploy a stream', () => {
    cy.get('.datagrid-action-toggle').first().click();
    cy.get('.datagrid-action-overflow button:nth-child(2)').first().click();
    cy.get('button[data-cy=deploy]').click();
    // Waiting 10s for deploying
    cy.wait(10 * 1000).then(() => {
      cy.get('span.pagination-total').should(elem => {
        expect(Number(elem.text())).to.equal(2);
      });
    });
  });

  it('should undeploy a stream', () => {
    cy.get('.datagrid-action-toggle').first().click();
    cy.get('.datagrid-action-overflow button:nth-child(3)').first().click();
    cy.get('button[data-cy="undeploy"]').should('be.exist');
    cy.get('button[data-cy="undeploy"]').click();
    cy.shouldShowToast('Undeploy stream', 'Successfully undeploy stream "bar".');
    cy.get('span.pagination-total').should(elem => {
      expect(Number(elem.text())).to.equal(2);
    });
  });

  it('should clone a stream', () => {
    cy.get('.datagrid-action-toggle').first().click();
    cy.get('.datagrid-action-overflow button:nth-child(4)').first().click();
    cy.get('button[data-cy="clone"]').should('be.exist');
    cy.get('button[data-cy="clone"]').click();
    cy.shouldShowToast('Stream(s) clone', 'Stream(s) have been cloned successfully');
    cy.get('span.pagination-total').should(elem => {
      expect(Number(elem.text())).to.equal(3);
    });
  });

  // it('Group action for deploy streams', () => {
  //   cy.checkExistence('span[data-cy=streams-total]');
  //   cy.get('.apps-total').should(elem => {
  //     expect(Number(elem.text())).to.gt(0);
  //   });
  //   cy.get('.apps-total').then($appTotal => {
  //     const initialAddedApps = $appTotal.text();
  //     cy.get('button#btnGroupActions').click();
  //     cy.get('input[type="checkbox"] + label').first().click();
  //     cy.get('button#btnUnregisterApplications').click();
  //     cy.checkExistence('.modal button');
  //     cy.get('.modal button').last().click();
  //     cy.get('clr-spinner').should('not.exist');
  //     cy.get('.content-area').scrollTo('bottom');
  //     cy.checkExistence('.apps-total');
  //     cy.get('.apps-total').then($appUpdatedTotal => {
  //       expect(Number($appUpdatedTotal.text())).to.lt(Number(initialAddedApps));
  //     });
  //   });
  // });
});
