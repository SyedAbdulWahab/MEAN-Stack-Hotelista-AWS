import { TestBed, inject } from '@angular/core/testing';


import { MyAuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyAuthService]
    });
  });

  it('should be created', inject([MyAuthService], (service: MyAuthService) => {
    expect(service).toBeTruthy();
  }));
});
