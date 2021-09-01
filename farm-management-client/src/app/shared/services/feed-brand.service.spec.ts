import { TestBed } from '@angular/core/testing';

import { FeedBrandService } from './feed-brand.service';

describe('FeedBrandService', () => {
  let service: FeedBrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedBrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
