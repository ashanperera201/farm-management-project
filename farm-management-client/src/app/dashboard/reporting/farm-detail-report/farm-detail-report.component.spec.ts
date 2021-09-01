import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDetailReportComponent } from './farm-detail-report.component';

describe('FarmDetailReportComponent', () => {
  let component: FarmDetailReportComponent;
  let fixture: ComponentFixture<FarmDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
