import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SecurityInfo } from './security-info.model';

describe('AppsService', () => {

  fdescribe('hasAnyRoleOf', () => {

    it('should call the apps service with the right url to get all apps', () => {
      const securityInfo = new SecurityInfo(false, false, false, false, 'username', ['VIEW', 'EDIT']);

      expect(securityInfo.hasAnyRoleOf(['VIEW'])).toBe(true);
    });

    it('should call the apps service with the right url to get all apps', () => {
      const securityInfo = new SecurityInfo(false, false, false, false, 'username', ['VIEW', 'EDIT']);

      expect(securityInfo.hasAnyRoleOf(['NOTHING'])).toBe(false);
    });

     it('should call the apps service with the right url to get all apps', () => {
      const securityInfo = new SecurityInfo(false, false, false, false, 'username', ['VIEW', 'EDIT']);

      expect(securityInfo.hasAnyRoleOf(['VIEW', 'SOMETHING_ELSE'])).toBe(true);
    });

     it('should call the apps service with the right url to get all apps', () => {
      const securityInfo = new SecurityInfo(false, false, false, false, 'username', ['VIEW', 'EDIT']);

      expect(securityInfo.hasAnyRoleOf(['SOMETHING_ELSE', 'VIEW', 'EDIT'])).toBe(true);
    });
  });

});
