import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySampleReportComponent } from './weekly-sample-report.component';

describe('WeeklySampleReportComponent', () => {
  let component: WeeklySampleReportComponent;
  let fixture: ComponentFixture<WeeklySampleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklySampleReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklySampleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
