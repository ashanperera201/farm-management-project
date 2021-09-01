import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySamplingAddComponent } from './weekly-sampling-add.component';

describe('WeeklySamplingAddComponent', () => {
  let component: WeeklySamplingAddComponent;
  let fixture: ComponentFixture<WeeklySamplingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklySamplingAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklySamplingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
