import { TestBed, inject } from '@angular/core/testing';

import { SystemsService } from './systems.service';

describe('SystemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemsService]
    });
  });

  it('should be created', inject([SystemsService], (service: SystemsService) => {
    expect(service).toBeTruthy();
  }));
});
