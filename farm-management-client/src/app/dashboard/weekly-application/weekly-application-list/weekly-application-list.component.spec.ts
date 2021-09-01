import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyApplicationListComponent } from './weekly-application-list.component';

describe('WeeklyApplicationListComponent', () => {
  let component: WeeklyApplicationListComponent;
  let fixture: ComponentFixture<WeeklyApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklyApplicationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
