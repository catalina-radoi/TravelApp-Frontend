import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickLocationModalComponent } from './pick-location-modal.component';

describe('PickLocationModalComponent', () => {
  let component: PickLocationModalComponent;
  let fixture: ComponentFixture<PickLocationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickLocationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
