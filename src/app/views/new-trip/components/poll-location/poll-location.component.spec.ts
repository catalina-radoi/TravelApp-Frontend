import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollLocationComponent } from './poll-location.component';

describe('PollLocationComponent', () => {
  let component: PollLocationComponent;
  let fixture: ComponentFixture<PollLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
