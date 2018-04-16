import { Injectable } from '@angular/core';
import { MyAuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class RoomService {

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

  // Function to create a new room post
  newRoom(room) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'rooms/newRoom', room, this.options).map(res => res.json());
  }

  // Function to create a new room post
  newRating(rating) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'rooms/newRating', rating, this.options).map(res => res.json());
  }
  // Function to get all rooms from the database
  getAllRooms() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'rooms/allRooms', this.options).map(res => res.json());
  }

  // Function to get the room using the id
  getSingleRoom(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'rooms/singleRoom/' + id, this.options).map(res => res.json());
  }

  // Function to edit/update room post
  editRoom(room) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'rooms/updateroom/', room, this.options).map(res => res.json());
  }

  // Function to delete a room
  deleteRoom(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'rooms/deleteRoom/' + id, this.options).map(res => res.json());
  }

  //TODO : change to book room
  // Function to book a room
  bookRoom(id) {
    const roomData = { id: id };
    return this.http.put(this.domain + 'rooms/bookRoom/' , roomData, this.options).map(res => res.json());
  }

}
