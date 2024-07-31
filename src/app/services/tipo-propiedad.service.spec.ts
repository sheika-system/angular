import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoPropiedadService } from './tipo-propiedad.service';
import { ITipoPropiedad } from '../interfaces';

describe('TipoPropiedadService', () => {
  let service: TipoPropiedadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipoPropiedadService]
    });
    service = TestBed.inject(TipoPropiedadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllSignal', () => {
    it('should update tipoPropiedadList signal with reversed data', () => {
      const dummyTiposPropiedades: ITipoPropiedad[] = [
        { tipoPropiedadId: 1, nombre: 'Casa' },
        { tipoPropiedadId: 2, nombre: 'Apartamento' }
      ];

      service.getAllSignal();

      const req = httpMock.expectOne('tipo_propiedades');
      expect(req.request.method).toBe('GET');
      req.flush(dummyTiposPropiedades);

      expect(service.tipoPropiedades$()).toEqual(dummyTiposPropiedades.reverse());
    });

    it('should handle errors when fetching tipo propiedades', () => {
      spyOn(console, 'error');

      service.getAllSignal();

      const req = httpMock.expectOne('tipo_propiedades');
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));

      expect(console.error).toHaveBeenCalledWith('Error fetching tipo propiedades', jasmine.any(Object));
    });
  });

  describe('tipoPropiedades$', () => {
    it('should return the current value of tipoPropiedadList signal', () => {
      const dummyTiposPropiedades: ITipoPropiedad[] = [
        { tipoPropiedadId: 1, nombre: 'Casa' },
        { tipoPropiedadId: 2, nombre: 'Apartamento' }
      ];

      (service as any).tipoPropiedadList.set(dummyTiposPropiedades);

      expect(service.tipoPropiedades$()).toEqual(dummyTiposPropiedades);
    });
  });
});