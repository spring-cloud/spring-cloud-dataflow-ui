describe('Test application section', () => {
  it('Load applications page', () => {
    cy.visit('/')
    cy.get('.nav-content > a[routerlink = "apps"]').click()
  })
})
