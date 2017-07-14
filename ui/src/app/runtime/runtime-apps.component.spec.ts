import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuntimeAppsComponent } from './runtime-apps.component';

xdescribe('RuntimeAppsComponent', () => {
  let component: RuntimeAppsComponent;
  let fixture: ComponentFixture<RuntimeAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuntimeAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
