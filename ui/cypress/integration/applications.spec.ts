describe('Applications validation', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'))
    cy.get('.nav-content > a[routerlink = "apps"]').click()
  })

  it('Test add applications renders on table', () => {
    cy.importStreams()
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('Register a new application version', () => {
    cy.checkVisibility('.datagrid-row-scrollable clr-dg-cell')
    cy.get('.datagrid-row-scrollable clr-dg-cell a').first().click()
    cy.checkVisibility('app-view-card[titlemodal = "Information"]')
    cy.get('app-view-card[titlemodal = "Information"]').then($appDetails => {
      const applicationName = $appDetails.parents('h1#page-title strong:first-child').text()
      const applicationType = $appDetails.children('.row:first-child .value').text();
      const applicationVersion = $appDetails.children('.row:nth-child(2) .value').text();
      const applicationUri = $appDetails.children('.row:nth-child(3) .value').text();
      cy.log('applicationUri', applicationUri)
      cy.log('applicationName', applicationName)
      cy.log('applicationVersion', applicationVersion)
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
