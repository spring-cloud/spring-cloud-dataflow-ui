import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {DeploymentPropertiesComponent} from './deployment-properties.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {StreamDefinition} from '../../model/stream-definition';

/**
 * Test {@link DeploymentPropertiesComponent}.
 *
 * @author Damien Vitrac
 */
describe('DeploymentPropertiesComponent', () => {

  let component: DeploymentPropertiesComponent;
  let fixture: ComponentFixture<DeploymentPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeploymentPropertiesComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentPropertiesComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'undeployed');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate properties input', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'undeployed');
    component.stream.deploymentProperties = {a: 'a', b: 'b'};
    fixture.detectChanges();
    expect(component.deploymentProperties.value).toBe('a=a\nb=b');
  });

  it('should not populate properties input (empty)', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'undeployed');
    fixture.detectChanges();
    expect(component.deploymentProperties.value).toBe('');
  });

  it('should not populate properties input (invalid data)', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'undeployed');
    component.stream.deploymentProperties = 'aa';
    fixture.detectChanges();
    expect(component.deploymentProperties.value).toBe('');
  });

  it('should emit cancel event on cancel action', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'undeployed');
    fixture.detectChanges();
    const cancelEvent = spyOn(component.cancel, 'emit');
    component.cancelDeployment();
    expect(cancelEvent).toHaveBeenCalled();
  });

  it('should update the stream definition to deploy and emit event Submit on submit', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'undeployed');
    fixture.detectChanges();
    const submitEvent = spyOn(component.submit, 'emit');
    component.deploymentProperties.setValue('a=a');
    component.deployDefinition();
    expect(component.stream.deploymentProperties.a).toBe('a');
    expect(submitEvent).toHaveBeenCalled();
  });

});
