import { TestBed } from '@angular/core/testing';

import { WeeklySamplingService } from './weekly-sampling.service';

describe('WeeklySamplingService', () => {
  let service: WeeklySamplingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklySamplingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
