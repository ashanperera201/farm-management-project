import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySamplingListComponent } from './weekly-sampling-list.component';

describe('WeeklySamplingListComponent', () => {
  let component: WeeklySamplingListComponent;
  let fixture: ComponentFixture<WeeklySamplingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklySamplingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklySamplingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
