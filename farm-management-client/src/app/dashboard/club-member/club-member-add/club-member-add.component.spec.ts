import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubMemberAddComponent } from './club-member-add.component';

describe('ClubMemberAddComponent', () => {
  let component: ClubMemberAddComponent;
  let fixture: ComponentFixture<ClubMemberAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubMemberAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubMemberAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
