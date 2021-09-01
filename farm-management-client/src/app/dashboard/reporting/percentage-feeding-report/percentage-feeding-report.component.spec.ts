import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageFeedingReportComponent } from './percentage-feeding-report.component';

describe('PercentageFeedingReportComponent', () => {
  let component: PercentageFeedingReportComponent;
  let fixture: ComponentFixture<PercentageFeedingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentageFeedingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageFeedingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
