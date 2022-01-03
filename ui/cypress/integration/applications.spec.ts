describe('Applications area', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('.nav-content > a[routerlink = "apps"]').click()
  })

  it('Test add applications renders on table', () => {
    cy.addApplications()
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('Test group applications', () => {
    cy.addApplications()
    cy.get('button#btnGroupActions').click()
    cy.get('input[type="checkbox"] + label').first().click()
    cy.get('button#btnUnregisterApplications').click()
    cy.get('.modal button').last().click()
  })
})
