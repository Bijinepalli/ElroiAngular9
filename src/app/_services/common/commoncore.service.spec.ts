import { TestBed } from '@angular/core/testing';

import { CommoncoreService } from './commoncore.service';

describe('CommoncoreService', () => {
  let service: CommoncoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommoncoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
