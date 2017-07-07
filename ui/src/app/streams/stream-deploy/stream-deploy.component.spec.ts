import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamDeployComponent } from './stream-deploy.component';

describe('StreamDeployComponent', () => {
  let component: StreamDeployComponent;
  let fixture: ComponentFixture<StreamDeployComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamDeployComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamDeployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
