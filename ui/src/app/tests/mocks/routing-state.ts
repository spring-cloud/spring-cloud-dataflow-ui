/**
 * Mock for RoutingStateService.
 *
 * Create a mocked service:
 * const routingStateService = new MockRoutingStateService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: RoutingStateService, useValue: routingStateService }
 *   ]
 * }).compileComponents();
 *
 * @author Damien Vitrac
 */
export class MockRoutingStateService {

  public back(defaultUrl: string, isNotRegex?: RegExp) {}

}
