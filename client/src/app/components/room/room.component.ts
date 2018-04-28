import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyAuthService } from '../../services/auth.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  processing = false;
  username;
  messageClass;
  message;
  loadingRooms = false;
  form;
  isBooked;
  newPost = false;
  roomPosts;
  lambda = 'https://pcq2n3e7fl.execute-api.us-west-2.amazonaws.com/prod/number';

  constructor(
    private formBuilder: FormBuilder,
    private authService: MyAuthService,
    private roomService: RoomService
  ) {

  }


  // Validation for title
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true } // Return error in validation
    }
  }

  // Function to display new Room form
  newRoomForm() {
    this.newPost = true; // Show new Room form
  }

  // Function to create new Room form
  createNewRoomForm() {
    this.form = this.formBuilder.group({
      // Title field
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      // Body field
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])],
      price: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(10)
      ])]
    })
  }

  // Enable new room form
  enableFormNewRoomForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable(); // Enable body field
  }

  // Disable new room form
  disableFormNewRoomForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('body').disable(); // Disable body field
  }

  onRoomSubmit() {
    this.processing = true; // Disable submit button
    this.disableFormNewRoomForm(); // Lock form

    // Create room object from form fields
    const room = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      price: this.form.get('price').value,
      isBooked: false // Booked field
    }

    // Function to save room into database
    this.roomService.newRoom(room).subscribe(data => {
      // Check if Room was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewRoomForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        this.getAllRooms();
        // Clear form data after two seconds
        setTimeout(() => {
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewRoomForm(); // Enable the form fields
        }, 2000);
      }
    });
  }

  // Function to go back to previous page
  goBack() {
    window.location.reload(); // Clear all variable states
  }

  // Function to book a room
  BookRoom(id) {
    if (this.isBooked)
      return;

    var obj = {
      title: id,
      username: this.username
    }

    // Service to book a Room
    this.roomService.bookRoom(obj).subscribe(data => {
      this.getAllRooms(); // Refresh Rooms after booked
    });
  }

  // Reload rooms on current page
  reloadRooms() {
    this.loadingRooms = true; // Used to lock button
    this.getAllRooms(); // Add any new rooms to the page
    setTimeout(() => {
      this.loadingRooms = false; // Release button lock after four seconds
    }, 4000);
  }

  // Function to get all rooms from the database
  getAllRooms() {
    // Function to GET all rooms from database
    this.roomService.getAllRooms().subscribe(data => {
      this.roomPosts = data.rooms; // Assign array to use in HTML
    });
  }

  ngOnInit() {
    // Get profile username on page load

    var provider = localStorage.getItem('_login_provider');

    if (provider == 'google' || provider == 'facebook') {
      this.username = localStorage.getItem('name');
    }
    else {
      this.authService.getProfile().subscribe(profile => {
        this.username = profile.user.username; // Used when creating new room posts and comments
      });
    }

    this.getAllRooms(); // Get all rooms on component load
  }

}
