describe('Applications area', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('.nav-content > a[routerlink = "apps"]').click()
  })

  it('Check add applications flow', () => {
    cy.get('button#btnAddApplications').click()
    cy.get('[value="stream.kafka.docker"] + label').click()
    cy.get('button[type=submit]').click()
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })
})
