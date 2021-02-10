import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEditGroupModalComponent } from './new-edit-group-modal.component';

describe('NewEditGroupModalComponent', () => {
  let component: NewEditGroupModalComponent;
  let fixture: ComponentFixture<NewEditGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEditGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEditGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
