import { TestBed } from '@angular/core/testing';

import { PuntoInteresService } from './punto-interes.service';

describe('PuntoInteresService', () => {
  let service: PuntoInteresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuntoInteresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
