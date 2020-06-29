import { OnDestroy, OnInit, Directive } from '@angular/core';


/**
 * Mock for Response Object.
 *
 * Provide mocked component can be used with a RouterTestingModule.
 * RouterTestingModule.withRoutes([{ path: 'streams/definitions', component: MockComponent }])
 *
 * @author Glenn Renfro
 */
@Directive()
export class MockComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
