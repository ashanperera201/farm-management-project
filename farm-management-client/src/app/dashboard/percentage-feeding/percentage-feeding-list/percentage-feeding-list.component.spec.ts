import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageFeedingListComponent } from './percentage-feeding-list.component';

describe('PercentageFeedingListComponent', () => {
  let component: PercentageFeedingListComponent;
  let fixture: ComponentFixture<PercentageFeedingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentageFeedingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageFeedingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
