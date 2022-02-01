describe('Streams validation', () => {

  const goToStreams = () => {
    cy.get('clr-vertical-nav-group[appfeature = "streams"]').click()
  }

  before(()=> {
    cy.visit(Cypress.config('baseUrl'))
    goToStreams()
    cy.importStreams()
    goToStreams()
    cy.createStream()
  })

  beforeEach(() => {
    cy.checkVisibility('a[routerlink = "streams/list"]')
    cy.get('a[routerlink = "streams/list"]').first().click()
  })

  it('Create a stream and render it on table', () => {
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('View details for selected stream', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button').first().click()
    cy.checkExistence('app-view-card')
    cy.get('app-view-card').should('have.id','info')
  })

  it('Deploy selected stream', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(2)').first().click()
    cy.checkExistence('.modal-dialog button')
    cy.get('.modal-dialog button').last().click()
  })

  it('Destroy selected stream', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(3)').first().click()
    cy.checkExistence('.modal-dialog button')
    cy.get('.modal-dialog button').last().click()
  })

  it('Clone selected stream', () => {
    cy.get('.datagrid-action-toggle').last().click()
    cy.get('.datagrid-action-overflow button:nth-child(4)').first().click()
    cy.checkExistence('.modal-dialog button')
    cy.get('.modal-dialog button').last().click()
  })

  it('Group action for deploy stream', () => {
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
