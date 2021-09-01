import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMemberListComponent } from './club-member-list.component';

describe('ClubMemberListComponent', () => {
  let component: ClubMemberListComponent;
  let fixture: ComponentFixture<ClubMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubMemberListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
