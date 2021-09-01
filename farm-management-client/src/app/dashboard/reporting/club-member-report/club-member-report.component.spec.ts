import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMemberReportComponent } from './club-member-report.component';

describe('ClubMemberReportComponent', () => {
  let component: ClubMemberReportComponent;
  let fixture: ComponentFixture<ClubMemberReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubMemberReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMemberReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
