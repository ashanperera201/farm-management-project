import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPriceAddComponent } from './sales-price-add.component';

describe('SalesPriceAddComponent', () => {
  let component: SalesPriceAddComponent;
  let fixture: ComponentFixture<SalesPriceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPriceAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPriceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
