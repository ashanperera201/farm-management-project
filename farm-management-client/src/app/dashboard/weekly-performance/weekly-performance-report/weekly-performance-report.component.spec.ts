import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPerformanceReportComponent } from './weekly-performance-report.component';

describe('WeeklyPerformanceReportComponent', () => {
  let component: WeeklyPerformanceReportComponent;
  let fixture: ComponentFixture<WeeklyPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyPerformanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
