import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPriceListComponent } from './sales-price-list.component';

describe('SalesPriceListComponent', () => {
  let component: SalesPriceListComponent;
  let fixture: ComponentFixture<SalesPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPriceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
