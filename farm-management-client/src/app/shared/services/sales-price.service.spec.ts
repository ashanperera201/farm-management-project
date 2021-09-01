import { TestBed } from '@angular/core/testing';

import { SalesPriceService } from './sales-price.service';

describe('SalesPriceService', () => {
  let service: SalesPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
