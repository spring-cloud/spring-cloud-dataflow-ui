/**
 * Mock for BsModalService.
 *
 * Provide mocked service to testbed:
 * const modalService = new MockModalService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: BsModalService, useValue: modalService }
 *   ]
 * }).compileComponents();
 *
 * @author Damien Vitrac
 */
export class MockModalService {

  content;

  show(instance) {}

}
