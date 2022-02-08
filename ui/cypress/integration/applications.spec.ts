describe('Applications', () => {
  // const setDefaultVersion = (appName: string, appVersion: string) => {
  //   cy.get('clr-dg-cell a').contains(appName).parent().next().next().get('span').should('has.class', 'badge');
  //   cy.get('clr-dg-cell a')
  //     .contains(appName)
  //     .parentsUntil('clr-dg-row')
  //     .children('.datagrid-row-sticky')
  //     .first()
  //     .click();
  //   cy.checkExistence('div[role = "menu"]');
  //   cy.get('div[role = "menu"] button:nth-child(2)').click();
  //   cy.checkVisibility('.modal-content tr');
  //   cy.get('.modal-content tr').children('td').not('clr-icon').last().children('button').last().click();
  //   cy.checkVisibility('.modal-content button.btn-primary');
  //   cy.get('.modal-content button.btn-primary').click();
  //   cy.get('.modal-content button.close').click();
  //   cy.checkExistence('app-apps-list');
  //   cy.get('clr-dg-cell a').contains(appName).parent().next().next().get('span.label').contains(appVersion);
  // };

  beforeEach(() => {
    cy.apps();
  });

  after(() => {});

  it('should import applications', () => {
    cy.importStreams();
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1);
  });

  it('should navigate to the application details', () => {
    cy.checkVisibility('.datagrid-row-scrollable clr-dg-cell');
    cy.get('.datagrid-row-scrollable clr-dg-cell a').first().click();
    // cy.get('app-view-card[titlemodal = "Information"]').should('be.visible');
    // cy.get('app-view-card[titlemodal = "Application properties"]').should('be.visible');
  });

  it('should register 2 versions of an application', () => {
    cy.appCreate();
    cy.get('clr-accordion-title[data-cy=register]').click();
    cy.get('input[name = "name0"]').type('aaaa');
    cy.get('select[name = "type0"]').select('source');
    cy.get('input[name = "uri0"]').type('maven://org.springframework.cloud.task.app:timestamp-task:2.1.1.RELEASE');
    cy.get('button[name = "register"]').click();
    cy.checkToastAnimation();
    cy.checkExistence('app-apps-list');

    cy.appCreate();
    cy.get('clr-accordion-title[data-cy=register]').click();
    cy.get('input[name = "name0"]').type('aaaa');
    cy.get('select[name = "type0"]').select('source');
    cy.get('input[name = "uri0"]').type('maven://org.springframework.cloud.task.app:timestamp-task:2.0.0.RELEASE');
    cy.get('button[name = "register"]').click();
    cy.checkToastAnimation();
    cy.checkExistence('app-apps-list');
  });

  it('should change the default version', () => {
    cy.get('clr-dg-cell a')
      .contains('aaaa')
      .parentsUntil('clr-dg-row')
      .children('.datagrid-row-sticky')
      .first()
      .click();
    cy.checkExistence('div[role = "menu"]');
    cy.get('div[role = "menu"] button:nth-child(2)').click();
    cy.get('.modal-title').contains('Manage versions');
    cy.get('button[data-cy="setDefault"]').first().click();

    // cy.get('table[data-cy="tableVersions"] tr').contains('Manage versions');
    // tableVersions

    //   cy.get('.modal-content tr').children('td').not('clr-icon').last().children('button').last().click();
    //   cy.checkVisibility('.modal-content button.btn-primary');
    //   cy.get('.modal-content button.btn-primary').click();
    //   cy.get('.modal-content button.close').click();
    //   cy.checkExistence('app-apps-list');
    //   cy.get('clr-dg-cell a').contains(appName).parent().next().next().get('span.label').contains(appVersion);
  });

  // it('should unregister an application', () => {
  //   cy.checkExistence('.apps-total');
  //   cy.get('.apps-total').should(elem => {
  //     expect(Number(elem.text())).to.gt(0);
  //   });
  //   cy.get('.apps-total').then($appTotal => {
  //     const initialAddedApps = $appTotal.text();
  //     cy.get('.datagrid-action-toggle').last().click();
  //     cy.checkExistence('.datagrid-action-overflow button');
  //     cy.get('.datagrid-action-overflow button').last().click();
  //     cy.checkExistence('.modal-dialog button');
  //     cy.get('.modal-dialog button').last().click();
  //     cy.get('clr-spinner').should('not.exist');
  //     cy.get('.modal-body').should('not.be.exist');
  //     cy.get('.content-area').scrollTo('bottom');
  //     cy.get('.datagrid-footer').should('be.visible');
  //     cy.checkVisibility('.apps-total');
  //     cy.get('.apps-total').then($appUpdatedTotal => {
  //       expect(Number($appUpdatedTotal.text())).to.eq(Number(initialAddedApps) - 1);
  //     });
  //   });
  // });

  // it('should navigate to the details application', () => {
  //   cy.checkExistence('.apps-total');
  //   cy.get('.apps-total').then($appTotal => {
  //     cy.get('.datagrid-action-toggle').last().click();
  //     cy.get('.datagrid-action-overflow button').first().click();
  //     cy.checkExistence('app-view-card');
  //     cy.get('app-view-card').should('have.id', 'info');
  //   });
  // });

  // it('should unregister applications', () => {
  //   cy.checkExistence('.apps-total');
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
  //     cy.checkLoadingDone();
  //     cy.get('.content-area').scrollTo('bottom');
  //     cy.checkExistence('.apps-total');
  //     cy.get('.apps-total').then($appUpdatedTotal => {
  //       expect(Number($appUpdatedTotal.text())).to.lt(Number(initialAddedApps));
  //     });
  //   });
  // });
});
