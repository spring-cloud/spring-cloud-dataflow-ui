import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { SettingsService } from './settings.service';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';

describe('SettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      StoreModule.forRoot({}),
      LocalStorageModule.forRoot({
        prefix: 'dataflow-test-',
        storageType: 'localStorage'
      })
    ],
    providers: [
      LocalStorageService
    ]
  }));

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
