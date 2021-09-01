import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestDetailReportComponent } from './harvest-detail-report.component';

describe('HarvestDetailReportComponent', () => {
  let component: HarvestDetailReportComponent;
  let fixture: ComponentFixture<HarvestDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
