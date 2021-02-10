import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickedGroupComponent } from './picked-group.component';

describe('PickedGroupComponent', () => {
  let component: PickedGroupComponent;
  let fixture: ComponentFixture<PickedGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickedGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickedGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
