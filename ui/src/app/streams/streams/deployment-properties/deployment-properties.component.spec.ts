import { TestBed, async, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { DeploymentPropertiesComponent } from './deployment-properties.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StreamDefinition } from '../../model/stream-definition';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { StreamsService } from '../../streams.service';

/**
 * Test {@link DeploymentPropertiesComponent}.
 *
 * @author Damien Vitrac
 */
describe('DeploymentPropertiesComponent', () => {

  let component: DeploymentPropertiesComponent;
  let fixture: ComponentFixture<DeploymentPropertiesComponent>;
  const sharedAboutService = new MocksSharedAboutService();
  const streamsService = new MockStreamsService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeploymentPropertiesComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: SharedAboutService, useValue: sharedAboutService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentPropertiesComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'time | log', 'demo-description', 'undeployed');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate properties input', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'time | log', 'demo-description', 'undeployed');
    component.stream.deploymentProperties = { a: 'a', b: 'b' };
    fixture.detectChanges();
    expect(component.deploymentProperties.value).toBe('a=a\nb=b');
  });

  it('should not populate properties input (empty)', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'time | log', 'demo-description', 'undeployed');
    fixture.detectChanges();
    expect(component.deploymentProperties.value).toBe('');
  });

  it('should display the platform input (skipper integration)', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'time | log', 'demo-description', 'undeployed');
    component.stream.deploymentProperties = {};
    fixture.detectChanges();
    const de: DebugElement = fixture.debugElement.query(By.css('#groupPlatform'));
    const el: HTMLElement = fixture.debugElement.query(By.css('#deploymentPlatform')).nativeElement;
    expect(de == null).not.toBeTruthy();
    expect(el.innerHTML.indexOf('foo (bar)') !== -1).toBe(true);
    expect(el.innerHTML.indexOf('default (local)') !== -1).toBe(true);
  });

  it('should not populate properties input (invalid data)', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'time | log', 'demo-description', 'undeployed');
    component.stream.deploymentProperties = 'aa';
    fixture.detectChanges();
    expect(component.deploymentProperties.value).toBe('');
  });

  it('should emit cancel event on cancel action', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'time | log', 'demo-description', 'undeployed');
    fixture.detectChanges();
    const cancelEvent = spyOn(component.cancel, 'emit');
    component.cancelDeployment();
    expect(cancelEvent).toHaveBeenCalled();
  });

  it('should update the stream definition to deploy and emit event Submit on submit', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'time | log', 'demo-description', 'undeployed');
    fixture.detectChanges();
    const submitEvent = spyOn(component.submit, 'emit');
    component.deploymentProperties.setValue('a=a');
    component.deployDefinition();
    expect(component.stream.deploymentProperties.a).toBe('a');
    expect(submitEvent).toHaveBeenCalled();
  });

  it('should update the stream definition to deploy with multiple properties and emit event Submit on submit', () => {
    component.stream = new StreamDefinition('foo2', 'time |log', 'time | log', 'demo-description', 'undeployed');
    fixture.detectChanges();
    const submitEvent = spyOn(component.submit, 'emit');
    component.deploymentProperties.setValue('a=a\nb=c=d\ne=f');
    component.deployDefinition();
    expect(component.stream.deploymentProperties.a).toBe('a');
    expect(component.stream.deploymentProperties.b).toBe('c=d');
    expect(component.stream.deploymentProperties.e).toBe('f');

    expect(submitEvent).toHaveBeenCalled();
  });

});
