import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMemberCardComponent } from './club-member-card.component';

describe('ClubMemberCardComponent', () => {
  let component: ClubMemberCardComponent;
  let fixture: ComponentFixture<ClubMemberCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubMemberCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMemberCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
