import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamDefinitionsComponent } from './stream-definitions.component';

xdescribe('StreamDefinitionsComponent', () => {
  let component: StreamDefinitionsComponent;
  let fixture: ComponentFixture<StreamDefinitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamDefinitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
