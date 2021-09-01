import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionAddComponent } from './user-permission-add.component';

describe('UserPermissionAddComponent', () => {
  let component: UserPermissionAddComponent;
  let fixture: ComponentFixture<UserPermissionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
