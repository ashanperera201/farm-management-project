import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwbDetailReportComponent } from './awb-detail-report.component';

describe('AwbDetailReportComponent', () => {
  let component: AwbDetailReportComponent;
  let fixture: ComponentFixture<AwbDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwbDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwbDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
