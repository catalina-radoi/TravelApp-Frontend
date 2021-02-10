import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickIntervalComponent } from './pick-interval.component';

describe('PickIntervalComponent', () => {
  let component: PickIntervalComponent;
  let fixture: ComponentFixture<PickIntervalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickIntervalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickIntervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
