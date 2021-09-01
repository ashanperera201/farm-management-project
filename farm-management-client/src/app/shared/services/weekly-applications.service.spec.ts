import { TestBed } from '@angular/core/testing';

import { WeeklyApplicationsService } from './weekly-applications.service';

describe('WeeklyApplicationsService', () => {
  let service: WeeklyApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyApplicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
