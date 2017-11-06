import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {TemplateRef} from '@angular/core';

/**
 * Mock for BsModalRef.
 *
 * Provide mocked service to testbed:
 * const bsModalRef = new MockBsModalRef();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: BsModalRef, useValue: bsModalRef }
 *   ]
 * }).compileComponents();
 *
 * @author Damien Vitrac
 */
export class MockBsModalRef extends BsModalRef {
  hide = Function
}
