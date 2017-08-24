import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

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

});
