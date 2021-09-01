import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyApplicationReportComponent } from './weekly-application-report.component';

describe('WeeklyApplicationReportComponent', () => {
  let component: WeeklyApplicationReportComponent;
  let fixture: ComponentFixture<WeeklyApplicationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyApplicationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyApplicationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
