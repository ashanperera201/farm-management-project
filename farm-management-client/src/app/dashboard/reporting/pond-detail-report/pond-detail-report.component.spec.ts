import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PondDetailReportComponent } from './pond-detail-report.component';

describe('PondDetailReportComponent', () => {
  let component: PondDetailReportComponent;
  let fixture: ComponentFixture<PondDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PondDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PondDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
