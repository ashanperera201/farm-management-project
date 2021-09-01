import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageFeedingAddComponent } from './percentage-feeding-add.component';

describe('PercentageFeedingAddComponent', () => {
  let component: PercentageFeedingAddComponent;
  let fixture: ComponentFixture<PercentageFeedingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercentageFeedingAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageFeedingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
