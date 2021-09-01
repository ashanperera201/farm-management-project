import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFeedListComponent } from './daily-feed-list.component';

describe('DailyFeedListComponent', () => {
  let component: DailyFeedListComponent;
  let fixture: ComponentFixture<DailyFeedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyFeedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyFeedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
