import { TestBed } from '@angular/core/testing';

import { DailyFeedService } from './daily-feed.service';

describe('DailyFeedService', () => {
  let service: DailyFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
