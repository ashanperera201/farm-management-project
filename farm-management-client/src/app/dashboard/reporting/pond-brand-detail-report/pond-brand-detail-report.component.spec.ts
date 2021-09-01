import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondBrandDetailReportComponent } from './pond-brand-detail-report.component';

describe('PondBrandDetailReportComponent', () => {
  let component: PondBrandDetailReportComponent;
  let fixture: ComponentFixture<PondBrandDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondBrandDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondBrandDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
