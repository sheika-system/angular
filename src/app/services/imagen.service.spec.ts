import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImagenService } from './imagen.service';
import { IImagen, IPropiedad } from '../interfaces';

describe('ImagenService', () => {
  let service: ImagenService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImagenService]
    });
    service = TestBed.inject(ImagenService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllSignal', () => {
    it('should update imagenesPropiedad signal with fetched data', () => {
      const propiedadId = 1;
      const dummyPropiedad: IPropiedad = { propiedadId: 1 };
      const dummyImagenes: IImagen[] = [
        { imagenId: 1, descripcion: 'Imagen 1', imagen: 'base64string1', propiedad: dummyPropiedad },
        { imagenId: 2, descripcion: 'Imagen 2', imagen: 'base64string2', propiedad: dummyPropiedad }
      ];

      service.getAllSignal(propiedadId);

      const req = httpMock.expectOne(`imagenes/propiedad/${propiedadId}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyImagenes);

      expect(service.imagenesPropiedad$()).toEqual(dummyImagenes);
    });

    it('should handle errors when fetching imagenes', () => {
      spyOn(console, 'error');
      const propiedadId = 1;

      service.getAllSignal(propiedadId);

      const req = httpMock.expectOne(`imagenes/propiedad/${propiedadId}`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));

      expect(console.error).toHaveBeenCalledWith('Error fetching imagenes', jasmine.any(Object));
    });
  });

  describe('imagenesPropiedad$', () => {
    it('should return the current value of imagenesPropiedad signal', () => {
      const dummyPropiedad: IPropiedad = { propiedadId: 1 };
      const dummyImagenes: IImagen[] = [
        { imagenId: 1, descripcion: 'Imagen 1', imagen: 'base64string1', propiedad: dummyPropiedad },
        { imagenId: 2, descripcion: 'Imagen 2', imagen: 'base64string2', propiedad: dummyPropiedad }
      ];

      (service as any).imagenesPropiedad.set(dummyImagenes);

      expect(service.imagenesPropiedad$()).toEqual(dummyImagenes);
    });
  });

  describe('saveImagenSignal', () => {
    it('should add a new imagen and update the signal', (done) => {
      const dummyPropiedad: IPropiedad = { propiedadId: 1 };
      const newImagen: IImagen = { descripcion: 'Nueva Imagen', imagen: 'base64string3', propiedad: dummyPropiedad };
      const savedImagen: IImagen = { imagenId: 3, ...newImagen };

      service.saveUbicacionSignal(newImagen).subscribe({
        next: (response) => {
          expect(response).toEqual(savedImagen);
          expect(service.imagenesPropiedad$()[0]).toEqual(savedImagen);
          done();
        },
        error: (error) => done.fail(error)
      });

      const req = httpMock.expectOne('imagenes');
      expect(req.request.method).toBe('POST');
      req.flush(savedImagen);
    });

    it('should handle errors when saving imagen', (done) => {
      const dummyPropiedad: IPropiedad = { propiedadId: 1 };
      const newImagen: IImagen = { descripcion: 'Nueva Imagen', imagen: 'base64string3', propiedad: dummyPropiedad };
      spyOn(console, 'error');

      service.saveUbicacionSignal(newImagen).subscribe({
        next: () => done.fail('should have failed'),
        error: (error) => {
          expect(console.error).toHaveBeenCalledWith('Error saving imagenes', jasmine.any(Object));
          done();
        }
      });

      const req = httpMock.expectOne('imagenes');
      expect(req.request.method).toBe('POST');
      req.error(new ErrorEvent('Network error'));
    });
  });
});