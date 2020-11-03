import { MetamodelService } from './metamodel.service';
import { waitForAsync } from '@angular/core/testing';
import { MockSharedAppService } from '../../tests/service/app.service.mock';
import { ToolsServiceMock } from '../../tests/service/task-tools.service.mock';
import { LoggerService } from '../../shared/service/logger.service';

/**
 * Test Task metamodel service.
 *
 * @author Alex Boyko
 */
describe('Task MetamodelService', () => {

  const loggerService = new LoggerService();
  const METAMODEL_SERVICE = new MetamodelService(new MockSharedAppService(), loggerService, new ToolsServiceMock());

  it('two groups available', () => {
    expect(METAMODEL_SERVICE.groups()).toEqual(['control nodes', 'task']);
  });

  it('Verify task metamodel', waitForAsync(() => {
    METAMODEL_SERVICE.load().then(metamodel => {
      expect(Array.from(metamodel.keys())).toEqual(['links', 'control nodes', 'task']);
      const links = metamodel.get('links');
      const controlNodes = metamodel.get('control nodes');
      const tasks = metamodel.get('task');
      expect(Array.from(tasks.keys())).toEqual(['a', 'b', 'c', 'd', 'super-very-very-very-looooooooong-task-name']);
      expect(Array.from(controlNodes.keys())).toEqual(['START', 'END', 'SYNC']);
      expect(Array.from(links.keys())).toEqual(['transition']);
    });
  }));

  it('load() vs. refresh()', waitForAsync(() => {
    METAMODEL_SERVICE.load().then(metamodel => {
      METAMODEL_SERVICE.load().then(metamodel2 => {
        expect(metamodel2).toBe(metamodel);
        METAMODEL_SERVICE.refresh().then(metamodel3 => {
          expect(metamodel3 === metamodel).toBeFalsy();
        });
      });
    });
  }));

  it('clear cache', waitForAsync(() => {
    METAMODEL_SERVICE.load().then(metamodel => {
      METAMODEL_SERVICE.clearCachedData();
      METAMODEL_SERVICE.load().then(metamodel2 => {
        expect(metamodel2 !== metamodel).toBeTruthy();
      });
    });
  }));

});
