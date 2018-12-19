import { SecurityInfo } from './security-info.model';

describe('SecurityInfo', () => {

  describe('hasAnyRoleOf', () => {

    beforeEach(() => {
      this.securityInfo = new SecurityInfo();
      this.securityInfo.roles = ['VIEW', 'EDIT', 'MANAGE'];
    });

    it('should have the VIEW role', () => {
      expect(this.securityInfo.hasAnyRoleOf(['VIEW'])).toBe(true);
    });

    it('should have not any role', () => {
      this.securityInfo.roles = [];
      expect(this.securityInfo.hasAnyRoleOf(['VIEW'])).toBe(false);
    });

    it('should NOT have the NOTHING role', () => {
      expect(this.securityInfo.hasAnyRoleOf(['NOTHING'])).toBe(false);
    });

    it('should have the VIEW role (2 roles passed-in)', () => {
      expect(this.securityInfo.hasAnyRoleOf(['VIEW', 'SOMETHING_ELSE'])).toBe(true);
    });

    it('should have the VIEW or EDIT role (3 roles passed-in, non-existing-role first)', () => {
      expect(this.securityInfo.hasAnyRoleOf(['SOMETHING_ELSE', 'VIEW', 'EDIT'])).toBe(true);
    });
  });

  describe('canAccess', () => {

    it('should not have access with the VIEW role as user is not authenticated', () => {
      const securityInfo = new SecurityInfo();
      securityInfo.roles = ['VIEW', 'EDIT', 'MANAGE'];
      expect(securityInfo.canAccess(['VIEW'])).toBe(false);
    });

    it('should have access with the VIEW role', () => {
      const securityInfo = new SecurityInfo();
      securityInfo.isAuthenticated = true;
      securityInfo.roles = ['VIEW', 'EDIT', 'MANAGE'];
      expect(securityInfo.canAccess(['VIEW'])).toBe(true);
    });

    it('should NOT have access with the NOTHING role', () => {
      const securityInfo = new SecurityInfo();
      securityInfo.isAuthenticated = true;
      securityInfo.roles = ['VIEW', 'EDIT', 'MANAGE'];
      expect(securityInfo.canAccess(['NOTHING'])).toBe(false);
    });

    it('should have access with the VIEW role (2 roles passed-in)', () => {
      const securityInfo = new SecurityInfo();
      securityInfo.isAuthenticated = true;
      securityInfo.roles = ['VIEW', 'EDIT', 'MANAGE'];
      expect(securityInfo.canAccess(['VIEW', 'SOMETHING_ELSE'])).toBe(true);
    });

    it('no roles but user should have access with the VIEW role as authentication is disabled', () => {
      const securityInfo = new SecurityInfo();
      securityInfo.isAuthenticated = false;
      securityInfo.isAuthenticationEnabled = false;
      securityInfo.roles = [];
      expect(securityInfo.canAccess(['VIEW'])).toBe(true);
    });
    it('no roles and authenticated user should not have access with the VIEW role', () => {
      const securityInfo = new SecurityInfo();
      securityInfo.isAuthenticated = true;
      securityInfo.isAuthenticationEnabled = true;
      securityInfo.roles = [];
      expect(securityInfo.canAccess(['VIEW'])).toBe(false);
    });
  });

  describe('reset', () => {

    it('should reset SecurityInfo to default values', () => {
      const securityInfo = new SecurityInfo();
      securityInfo.isAuthenticated = true;
      securityInfo.isAuthenticationEnabled = false;
      securityInfo.username = 'Kamehameha';
      securityInfo.roles = ['VIEW', 'EDIT', 'MANAGE'];

      securityInfo.reset();

      expect(securityInfo.isAuthenticated).toBe(false);
      expect(securityInfo.isAuthenticationEnabled).toBe(true);
      expect(securityInfo.username).toBe('');
      expect(securityInfo.roles.length).toBe(0);
    });
  });

  describe('deserialize', () => {
    it('should deserialize a json object into a SecurityInfo object', () => {
      const json = {
        authenticated: true,
        authenticationEnabled: true,
        username: 'Kamehameha',
        roles: ['R1', 'R2']
      };

      const securityInfo = new SecurityInfo().deserialize(json);
      expect(securityInfo.isAuthenticated).toBe(true);
      expect(securityInfo.isAuthenticationEnabled).toBe(true);
      expect(securityInfo.username).toBe('Kamehameha');
      expect(securityInfo.roles.length).toBe(2);
      expect(securityInfo.roles).toEqual(['R1', 'R2']);
    });
  });
});
