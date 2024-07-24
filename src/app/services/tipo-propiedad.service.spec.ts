import { TestBed } from '@angular/core/testing';

import { TipoPropiedadService } from './tipo-propiedad.service';

describe('TipoPropiedadService', () => {
  let service: TipoPropiedadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoPropiedadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
