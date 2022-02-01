describe('Applications validation', () => {

  const registerApplicationVersion = (appName: string, appType: string, appUri: string, appVersionFullText: string, appCount: number) => {
    const appVersionLength: number = appVersionFullText.length;
    const prevAppVersion: string = appVersionFullText.substring(0, appVersionLength - 1);
    const newAppVersion: number = appCount + 1;
    const newVersionFullText: string = prevAppVersion+newAppVersion
    cy.get('.nav-content > a[routerlink = "apps"]').click()
    cy.get('button#btnAddApplications').click()
    cy.get('button.clr-accordion-header-button').first().click()
    cy.get('input[name = "name0"]').type(appName)
    cy.get('select[name = "type0"]').select(appType)
    cy.get('input[name = "uri0"]').type(appUri.replace(appVersionFullText, newVersionFullText))
    cy.get('button[name = "register"]').click()
    cy.checkToastAnimation()
    cy.checkExistence('app-apps-list')
    setDefaultVersion(appName, newVersionFullText)
  }

  const setDefaultVersion = (appName: string, appVersion: string) => {
    cy.get('clr-dg-cell a').contains(appName).parent().next().next().get('span').should('has.class','badge')
    cy.get('clr-dg-cell a').contains(appName).parentsUntil('clr-dg-row').children('.datagrid-row-sticky').first().click()
    cy.checkExistence('div[role = "menu"]')
    cy.get('div[role = "menu"] button:nth-child(2)').click()
    cy.checkVisibility('.modal-content tr')
    cy.get('.modal-content tr').children('td').not('clr-icon').last().children('button').last().click()
    cy.checkVisibility('.modal-content button.btn-primary')
    cy.get('.modal-content button.btn-primary').click()
    cy.get('.modal-content button.close').click()
    cy.checkExistence('app-apps-list')
    cy.get('clr-dg-cell a').contains(appName).parent().next().next().get('span.label').contains(appVersion)
  }

  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'))
    cy.get('.nav-content > a[routerlink = "apps"]').click()
  })

  it('Test add applications renders on table', () => {
    cy.importStreams()
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('Register a new application version and set default to it', () => {
    let applicationName, applicationType, applicationUri, applicationVersion: string
    cy.checkVisibility('.datagrid-row-scrollable clr-dg-cell')
    cy.get('.datagrid-row-scrollable clr-dg-cell a').first().click()
    cy.checkVisibility('app-view-card[titlemodal = "Information"]')
    cy.checkLoadingDone()
    cy.get('h1 strong:first-child').then($appName => {
      applicationName = $appName.text()
    })
    cy.get('.row:nth-child(1) .value span').first().then($appType => {
      applicationType = $appType.text()
    })
    cy.get('.row:nth-child(2) .value span').first().then($appVersion => {
      applicationVersion = $appVersion.text()
    })
    cy.get('.row:nth-child(3) .value').first().then($appUri => {
      applicationUri = $appUri.text()
    })
    cy.get('.row:nth-child(5) .value').first().then($appCount => {
      const applicationCount = Number($appCount.text())
      registerApplicationVersion(applicationName, applicationType, applicationUri, applicationVersion, applicationCount)
    })
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
      cy.get('clr-spinner').should('not.exist')
      cy.get('.modal-body').should('not.exist')
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
