import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDetailReportComponent } from './application-detail-report.component';

describe('ApplicationDetailReportComponent', () => {
  let component: ApplicationDetailReportComponent;
  let fixture: ComponentFixture<ApplicationDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
