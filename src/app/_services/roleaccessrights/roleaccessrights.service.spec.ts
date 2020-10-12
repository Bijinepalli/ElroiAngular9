import { TestBed } from '@angular/core/testing';

import { RoleaccessrightsService } from './roleaccessrights.service';

describe('RoleaccessrightsService', () => {
  let service: RoleaccessrightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleaccessrightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
