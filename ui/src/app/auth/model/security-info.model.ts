/**
 * Contains meta data about the state of security.
 *
 * @author Gunnar Hillert
 */
export class SecurityInfo {

  public isAuthenticationEnabled = true;
  public isAuthorizationEnabled = true;
  public isFormLogin = true;
  public isAuthenticated = false;
  public username = '';
  public roles: string[] = [];

  constructor(
    authenticationEnabled: boolean,
    authorizationEnabled: boolean,
    formLogin: boolean,
    authenticated: boolean,
    username: string,
    roles: string[]
  ) {
    this.isAuthenticationEnabled = authenticationEnabled;
    this.isAuthorizationEnabled = authorizationEnabled;
    this.isFormLogin = formLogin;
    this.isAuthenticated = authenticated;
    this.username = username;
    this.roles = roles;
  }

  /**
   * Set the SecurityInfo object to default values.
   */
  public reset() {
    this.isAuthenticationEnabled = true;
    this.isAuthorizationEnabled = true;
    this.isFormLogin = true;
    this.isAuthenticated = false;
    this.username = '';
    this.roles = [];
  }

  /**
   * Perform a check of the passed in collection of roles
   * against the colection of roles of the SecurityInfo object.
   *
   * Any occurrence of a single role will result in true
   * being returned.
   *
   * @param rolesToCheckFor
   */
  public hasAnyRoleOf(rolesToCheckFor: string[]): boolean {
    if (this.roles && this.roles.length > 0) {
      const foundRole = this.roles.find(securityInfoRole => {
        if (rolesToCheckFor.find(passedInRole => securityInfoRole === passedInRole)) {
          return true;
        } else {
          return false;
        }
      });

      return foundRole ? true : false;
    } else {
      return false;
    }
  }
}
