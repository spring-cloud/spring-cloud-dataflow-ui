import { GroupService } from '../../shared/service/group.service';

export class GroupServiceMock {

  static mock: GroupServiceMock = null;

  constructor() {
  }


  create(args): string {
    const key = 'foo';
    return key;
  }

  isSimilar(str: string): boolean {
    return true;
  }

  group(name) {
    return ['foo', 'bar'];
  }

  static get provider() {
    if (!GroupServiceMock.mock) {
      GroupServiceMock.mock = new GroupServiceMock();
    }
    return { provide: GroupService, useValue: GroupServiceMock.mock };
  }
}
