import { TestBed } from '@angular/core/testing';

import { PickIntervalService } from './pick-interval.service';

describe('PickIntervalService', () => {
  let service: PickIntervalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickIntervalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
