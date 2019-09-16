import { DeployedAppProperties, DeploymentPropertiesInfoComponent } from './deployment-properties-info.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { StreamsService } from '../../streams.service';
import { StreamDefinition } from '../../model/stream-definition';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

/**
 * Test {@link DeploymentPropertiesInfoComponent}.
 *
 * @author Alex Boyko
 */
describe('DeploymentPropertiesInfoComponent', () => {
  let component: DeploymentPropertiesInfoComponent;
  let fixture: ComponentFixture<DeploymentPropertiesInfoComponent>;

  const streamsService = new MockStreamsService();

  const deploymentProperties = {
    time: {
      'spring.property.key1': 'time_value1',
      'spring.property.key2': 'time_value2',
      'maven://org.springframework.cloud.stream.app:time-source-rabbit': '1.3.1.RELEASE'
    },
    log: {
      'spring.property.key1': 'log_value1',
      'spring.property.key2': 'log_value2',
      'maven://org.springframework.cloud.stream.app:log-sink-rabbit': '1.3.0.RELEASE'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeploymentPropertiesInfoComponent,
        LoaderComponent
      ],
      imports: [],
      providers: [
        { provide: StreamsService, useValue: streamsService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentPropertiesInfoComponent);
    component = fixture.componentInstance;
  });

  it('app title', () => {
    expect(component.getAppTitle(new DeployedAppProperties('test', '1.0.0', []))).toBe('test (1.0.0)');
    expect(component.getAppTitle(new DeployedAppProperties('test', '', []))).toBe('test');
    expect(component.getAppTitle(new DeployedAppProperties('test', undefined, []))).toBe('test');
  });

  it('data from stream definition', (done) => {
    const streamDef = new StreamDefinition('tick', 'time | log', 'time | log', 'demo-description', 'deployed');
    streamDef.deploymentProperties = deploymentProperties;
    component.streamDefinition = streamDef;
    component.deploymentProperties.subscribe(data => {
      expect(Array.isArray(data)).toBeTruthy();
      expect(data.length).toBe(2);

      const timeData = data[0];
      expect(timeData.name).toBe('time');
      expect(timeData.version).toBe('1.3.1.RELEASE');
      expect(timeData.props.length).toBe(2);
      expect(timeData.props[0].key).toBe('spring.property.key1');
      expect(timeData.props[0].value).toBe('time_value1');

      const logData = data[1];
      expect(logData.name).toBe('log');
      expect(logData.version).toBe('1.3.0.RELEASE');
      expect(logData.props.length).toBe(2);
      expect(logData.props[1].key).toBe('spring.property.key2');
      expect(logData.props[1].value).toBe('log_value2');

      done();
    });
  });

});
