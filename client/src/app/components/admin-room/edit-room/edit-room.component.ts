import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css']
})
export class EditRoomComponent implements OnInit {



  message;
  messageClass;
  room;
  processing = false;
  currentUrl;
  loading = true;
  // roomTypes = ['Single Room', 'Double Room',
  // 'Suite'];
  // availability = ['yes', 'no'];
  selectedAvail;
  selectedRt;
  allLoaded = false;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private roomService: RoomService,
    private router: Router
  ) { }

  // Function to Submit Update
  updateRoomSubmit() {



    this.room.image = "https://s3-us-west-2.amazonaws.com/ql-cf-templates-1519363680-b85b8fd649cbf407-us-west-2/" + this.room.image.slice(this.room.image.lastIndexOf("\\")+1);

    this.processing = true; // Lock form fields

    if (this.selectedAvail == 'yes') {
      this.selectedAvail = true;
    } else this.selectedAvail = false;

    this.room.available = this.selectedAvail;
    this.room.roomType = this.selectedRt;

    console.log(this.selectedAvail);

    // Function to send room object to backend
    this.roomService.editRoom(this.room).subscribe(data => {
      // Check if PUT request was a success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set error bootstrap class
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
      } else {
        this.messageClass = 'alert alert-success'; // Set success bootstrap class
        this.message = data.message; // Set success message
        // After two seconds, navigate back to room page
        setTimeout(() => {
          this.router.navigate(['/adminRoom']); // Navigate back to route page
        }, 2000);
      }
    });
  }

  // Function to go back to previous page
  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
    // Function to GET current room with id in params
    this.roomService.getSingleRoom(this.currentUrl.id).subscribe(data => {
      // Check if GET request was success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
      } else {
        this.room = data.room; // Save room object for use in HTML
        this.loading = false; // Allow loading of room form
      }
    });

  }

}
