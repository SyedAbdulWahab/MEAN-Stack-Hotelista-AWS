import { Injectable } from '@angular/core';
import { MyAuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class UserService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: MyAuthService,
    private http: Http
  ) { }

    // Function to create headers, add token, to be used in HTTP requests
    createAuthenticationHeaders() {
      this.authService.loadToken(); // Get token so it can be attached to headers
      // Headers configuration options
      this.options = new RequestOptions({
        headers: new Headers({
          'Content-Type': 'application/json', // Format set to JSON
          'authorization': this.authService.authToken // Attach token
        })
      });
    }

  // Function to get all users from the database
  getAllUsers() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'rooms/allUsers', this.options).map(res => res.json());
  }

  // Function to get the user using the id
  getSingleUser(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'rooms/singleUser/' + id, this.options).map(res => res.json());
  }

  // Function to delete a user
  deleteUser(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'rooms/deleteUser/' + id, this.options).map(res => res.json());
  }

}
