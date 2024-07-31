import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DelitoService } from './delito.service';
import { IDelito, PagedResponse } from '../interfaces';

describe('DelitoService', () => {
  let service: DelitoService;
  let httpMock: HttpTestingController;

  // Crear un objeto de delito completo que cumpla con la interfaz IDelito
  const mockDelito: IDelito = {
    delito: 'Robo',
    subdelito: 'Robo a mano armada',
    fecha: new Date('2023-01-01'),
    hora: '12:00',
    victima: 'Persona',
    subvictima: 'Adulto',
    edad: 30,
    sexo: 'Masculino',
    nacionalidad: 'Costarricense',
    provincia: 'San José',
    canton: 'Central',
    distrito: 'Catedral'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DelitoService]
    });
    service = TestBed.inject(DelitoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get paged delitos', () => {
    const mockResponse: PagedResponse<IDelito> = {
      content: [mockDelito, { ...mockDelito, delito: 'Hurto' }],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 10,
      pageable: {
        pageNumber: 0,
        pageSize: 0,
        sort: {
          empty: false,
          sorted: false,
          unsorted: false
        },
        offset: 0,
        paged: false
      },
      last: false,
      sort: {
        empty: false,
        sorted: false,
        unsorted: false
      },
      first: false,
      numberOfElements: 0,
      empty: false
    };

    service.getDelitosPaged(0, 10, 'robo', 'delito', 'ASC').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.url === 'delitos/paged');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.params.get('filter')).toBe('robo');
    expect(req.request.params.get('sortField')).toBe('delito');
    expect(req.request.params.get('sortDirection')).toBe('ASC');
    req.flush(mockResponse);
  });

  it('should get all delitos and update signal', () => {
    const mockDelitos: IDelito[] = [
      mockDelito,
      { ...mockDelito, delito: 'Hurto' }
    ];

    service.getAllSignal().subscribe(delitos => {
      expect(delitos).toEqual(mockDelitos.reverse());
      expect(service.delitos$()).toEqual(mockDelitos);
    });

    const req = httpMock.expectOne('delitos');
    expect(req.request.method).toBe('GET');
    req.flush(mockDelitos);
  });

  it('should return correct signals', () => {
    const testDelitos = [mockDelito];
    service['delitosListSignal'].set(testDelitos);
    service['totalCountSignal'].set(1);

    expect(service.delitos$()).toEqual(testDelitos);
    expect(service.totalCount$()).toBe(1);
  });
});
