import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/room.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-room',
  templateUrl: './delete-room.component.html',
  styleUrls: ['./delete-room.component.css']
})
export class DeleteRoomComponent implements OnInit {

  message;
  messageClass;
  foundRoom = false;
  processing = false;
  room;
  currentUrl;

  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  // Function to delete blogs
  deleteRoom() {
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.roomService.deleteRoom(this.currentUrl.id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error bootstrap class
        this.message = data.message; // Return error message
      } else {
        this.messageClass = 'alert alert-success'; // Return bootstrap success class
        this.message = data.message; // Return success message
        // After two second timeout, route to blog page
        setTimeout(() => {
          this.router.navigate(['/adminRoom']); // Route users to blog page
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL paramaters on page load
    // Function for GET request to retrieve blog
    this.roomService.getSingleRoom(this.currentUrl.id).subscribe(data => {
      // Check if request was successfull
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      } else {
        // Create the blog object to use in HTML
        this.room = {
          title: data.room.title, // Set title
          body: data.room.body, // Set body
          // booked: false // Booked field
        }
        this.foundRoom = true; // Displaly blog window
      }
    });
  }
}
