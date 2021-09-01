import { TestBed } from '@angular/core/testing';

import { PercentageFeedingService } from './percentage-feeding.service';

describe('PercentageFeedingService', () => {
  let service: PercentageFeedingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PercentageFeedingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
