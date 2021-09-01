import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyApplicationAddComponent } from './weekly-application-add.component';

describe('WeeklyApplicationAddComponent', () => {
  let component: WeeklyApplicationAddComponent;
  let fixture: ComponentFixture<WeeklyApplicationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyApplicationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyApplicationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
