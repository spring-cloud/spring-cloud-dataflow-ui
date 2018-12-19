import { Serializable } from '../serialization/serializable.model';
/**
 * Contains meta data about the state of security.
 *
 * @author Gunnar Hillert
 */
export class SecurityInfo implements Serializable<SecurityInfo> {

  public isAuthenticationEnabled = true;
  public isAuthenticated = false;
  public username = '';
  public roles: string[] = [];

  /**
   * Set the SecurityInfo object to default values.
   */
  public reset() {
    this.isAuthenticationEnabled = true;
    this.isAuthenticated = false;
    this.username = '';
    this.roles = [];
  }

  public deserialize(input) {
    this.isAuthenticationEnabled = input.authenticationEnabled,
    this.isAuthenticated = input.authenticated,
    this.username = input.username,
    this.roles = input.roles as string[];
    return this;
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

  public canAccess(appRoles: string[]): boolean {
    let found = false;
    if (!this.isAuthenticationEnabled) {
      found = true;
    } else {
      if (this.isAuthenticated) {
          if (this.hasAnyRoleOf(appRoles)) {
            found = true;
          }
      } else {
        found = false;
      }
    }
    return found;
  }
}
