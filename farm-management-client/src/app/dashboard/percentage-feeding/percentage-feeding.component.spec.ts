import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageFeedingComponent } from './percentage-feeding.component';

describe('PercentageFeedingComponent', () => {
  let component: PercentageFeedingComponent;
  let fixture: ComponentFixture<PercentageFeedingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentageFeedingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageFeedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
