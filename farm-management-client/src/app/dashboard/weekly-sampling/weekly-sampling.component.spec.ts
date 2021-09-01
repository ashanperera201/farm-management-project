import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySamplingComponent } from './weekly-sampling.component';

describe('WeeklySamplingComponent', () => {
  let component: WeeklySamplingComponent;
  let fixture: ComponentFixture<WeeklySamplingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklySamplingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklySamplingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
