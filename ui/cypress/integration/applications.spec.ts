describe('Applications validation', () => {

  const registerApplicationVersion = (appName, appType, appUri, appVersionFullText) => {
    const appVersionLength = appVersionFullText.length;
    const prevAppVersion = appVersionFullText.substring(0, appVersionLength - 1);
    const newAppVersion = Number(appVersionFullText.substring(appVersionLength - 1, appVersionLength)) + 1;
    cy.get('.nav-content > a[routerlink = "apps"]').click()
    cy.get('button#btnAddApplications').click()
    cy.get('button.clr-accordion-header-button').first().click()
    cy.get('input[name = "name0"]').type(appName)
    cy.get('select[name = "type0"]').select(appType)
    cy.get('input[name = "uri0"]').type(appUri.replace(appVersionFullText, prevAppVersion+newAppVersion))
    cy.get('button[name = "register"]').click()
    cy.checkToastAnimation()
    cy.checkExistence('app-apps-list')
  }

  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'))
    cy.get('.nav-content > a[routerlink = "apps"]').click()
  })

  it('Test add applications renders on table', () => {
    cy.importStreams()
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('Register a new application version', () => {
    let applicationName, applicationType, applicationUri, applicationVersion;
    cy.checkVisibility('.datagrid-row-scrollable clr-dg-cell')
    cy.get('.datagrid-row-scrollable clr-dg-cell a').first().click()
    cy.checkVisibility('app-view-card[titlemodal = "Information"]')
    cy.checkLoadingDone()
    cy.get('h1 strong:first-child').then($appName => {
      applicationName = $appName.text()
    })
    cy.get('.row:nth-child(2) .value span').first().then($appVersion => {
      applicationVersion = $appVersion.text()
    })
    cy.get('.row:nth-child(1) .value span').first().then($appType => {
      applicationType = $appType.text()
    });
    cy.get('.row:nth-child(3) .value').first().then($appUri => {
      applicationUri = $appUri.text()
      registerApplicationVersion(applicationName, applicationType, applicationUri, applicationVersion)
    });
  });

  it('Test unregister for selected application', () => {
    cy.importStreams()
    cy.checkExistence('.apps-total')
    cy.get('.apps-total').should((elem) => {
      expect(Number(elem.text())).to.gt(0);
    });
    cy.get('.apps-total').then($appTotal => {
      const initialAddedApps = $appTotal.text();
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button').last().click()
      cy.checkExistence('.modal-dialog button')
      cy.get('.modal-dialog button').last().click()
      cy.wait(600)
      cy.get('.modal-body').should('not.be.exist')
      cy.get('.content-area').scrollTo('bottom')
      cy.get('.datagrid-footer').should('be.visible')
      cy.checkVisibility('.apps-total')
      cy.get('.apps-total').then($appUpdatedTotal => {
        expect(Number($appUpdatedTotal.text())).to.eq(Number(initialAddedApps) - 1)
      })
    })
  })

  it('Test show details for selected application', () => {
    cy.importStreams()
    cy.checkExistence('.apps-total')
    cy.get('.apps-total').then($appTotal => {
      const initialAddedApps = Number($appTotal.text());
      cy.get('.datagrid-action-toggle').last().click()
      cy.get('.datagrid-action-overflow button').first().click()
      cy.checkExistence('app-view-card')
      cy.get('app-view-card').should('have.id','info')
    })
  })

  it('Test group action for unregister applications', () => {
    cy.importStreams()
    cy.checkExistence('.apps-total')
    cy.get('.apps-total').should((elem) => {
      expect(Number(elem.text())).to.gt(0);
    });
    cy.get('.apps-total').then($appTotal => {
      const initialAddedApps = $appTotal.text();
      cy.get('button#btnGroupActions').click()
      cy.get('input[type="checkbox"] + label').first().click()
      cy.get('button#btnUnregisterApplications').click()
      cy.checkExistence('.modal button')
      cy.get('.modal button').last().click()
      cy.checkLoadingDone()
      cy.get('.content-area').scrollTo('bottom')
      cy.checkExistence('.apps-total')
      cy.get('.apps-total').then($appUpdatedTotal => {
        expect(Number($appUpdatedTotal.text())).to.lt(Number(initialAddedApps))
      })
    })
  })
})
