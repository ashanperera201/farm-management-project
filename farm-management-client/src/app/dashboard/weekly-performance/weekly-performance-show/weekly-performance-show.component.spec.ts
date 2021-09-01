import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPerformanceShowComponent } from './weekly-performance-show.component';

describe('WeeklyPerformanceShowComponent', () => {
  let component: WeeklyPerformanceShowComponent;
  let fixture: ComponentFixture<WeeklyPerformanceShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyPerformanceShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyPerformanceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
