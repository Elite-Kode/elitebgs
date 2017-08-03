import { TestBed, inject } from '@angular/core/testing';

import { FactionsService } from './factions.service';

describe('FactionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FactionsService]
    });
  });

  it('should be created', inject([FactionsService], (service: FactionsService) => {
    expect(service).toBeTruthy();
  }));
});
