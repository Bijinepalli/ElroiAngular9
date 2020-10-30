import { TestBed } from '@angular/core/testing';

import { AlphasService } from './alphas.service';

describe('AlphasService', () => {
  let service: AlphasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
