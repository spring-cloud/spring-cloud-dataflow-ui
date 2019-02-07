/**
 * Mock for BlockerService.
 *
 * Create a mocked service:
 * const blockerService = new MockBlockerService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: BlockerService, useValue: blockerService }
 *   ]
 * }).compileComponents();
 */
export class MockBlockerService {

  _lock = false;

  constructor() {
  }

  lock() {
    this._lock = true;
  }

  unlock() {
    this._lock = false;
  }

}
