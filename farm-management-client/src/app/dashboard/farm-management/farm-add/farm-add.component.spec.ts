import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmAddComponent } from './farm-add.component';

describe('FarmAddComponent', () => {
  let component: FarmAddComponent;
  let fixture: ComponentFixture<FarmAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
