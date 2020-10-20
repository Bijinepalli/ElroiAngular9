import { TestBed } from '@angular/core/testing';

import { PortfolioanalysisService } from './portfolioanalysis.service';

describe('PortfolioanalysisService', () => {
  let service: PortfolioanalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioanalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
