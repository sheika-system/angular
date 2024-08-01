import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { IUser } from '../interfaces';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user by id and update the signal', () => {
    const mockUser: IUser = { id: 1, nombre: 'John Doe', email: 'john.doe@example.com' };

    // Call the method to test
    service.getByIdSignal(1);

    // Expect the HTTP request
    const req = httpMock.expectOne(req => req.url === 'users/1' && req.method === 'GET');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    // Access the signal value directly using the `user$` getter
    expect(service.user$()).toEqual(mockUser);
  });
});
