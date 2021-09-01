import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPriceComponent } from './sales-price.component';

describe('SalesPriceComponent', () => {
  let component: SalesPriceComponent;
  let fixture: ComponentFixture<SalesPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
