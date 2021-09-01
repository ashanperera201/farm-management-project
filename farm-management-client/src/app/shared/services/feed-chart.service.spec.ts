import { TestBed } from '@angular/core/testing';

import { FeedChartService } from './feed-chart.service';

describe('FeedChartService', () => {
  let service: FeedChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
