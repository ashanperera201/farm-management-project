import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestAddComponent } from './harvest-add.component';

describe('HarvestAddComponent', () => {
  let component: HarvestAddComponent;
  let fixture: ComponentFixture<HarvestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
