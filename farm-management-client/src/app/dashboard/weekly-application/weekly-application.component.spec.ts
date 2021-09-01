import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyApplicationComponent } from './weekly-application.component';

describe('WeeklyApplicationComponent', () => {
  let component: WeeklyApplicationComponent;
  let fixture: ComponentFixture<WeeklyApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
