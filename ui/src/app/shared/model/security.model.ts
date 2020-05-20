export class Security {
  public isAuthenticationEnabled = true;
  public isAuthenticated = false;
  public username = '';
  public roles: string[] = [];

  static parse(input) {
    const security = new Security();
    security.isAuthenticationEnabled = input.authenticationEnabled;
    security.isAuthenticated = input.authenticated;
    security.username = input.username;
    security.roles = input.roles as string[];
    return security;
  }

  public reset() {
    this.isAuthenticationEnabled = true;
    this.isAuthenticated = false;
    this.username = '';
    this.roles = [];
  }

  public hasAnyRoleOf(rolesToCheckFor: string[]): boolean {
    if (this.roles && this.roles.length > 0) {
      return !!this.roles
        .find(securityInfoRole => !!rolesToCheckFor.find(passedInRole => securityInfoRole === passedInRole));
    }
    return false;
  }

  public canAccess(appRoles: string[]): boolean {
    return (!this.isAuthenticationEnabled || (this.isAuthenticated && this.hasAnyRoleOf(appRoles)));
  }
}
