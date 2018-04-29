import { ScripthackComponent } from './../scripthack/scripthack.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import {Router, ActivatedRoute, Params} from '@angular/router';
import { MyAuthService } from '../../services/auth.service';
import { RoomService } from '../../services/room.service';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';



@Component({
  selector: 'app-admin-room',
  templateUrl: './admin-room.component.html',
  styleUrls: ['./admin-room.component.css']
})
export class AdminRoomComponent implements OnInit {

  processing = false;
  // username;
  messageClass;
  message;
  loadingRooms = false;
  form;
  isBooked;
  newPost = false;
  roomPosts;
  roomTypes = ['Single Room', 'Double Room',
    'Suite'];
  availability = ['yes', 'no'];
  selectedRoomType;
  selectedAvail;
  roomImage = "https://s3-us-west-2.amazonaws.com/ql-cf-templates-1519363680-b85b8fd649cbf407-us-west-2/";
  bucket;


  constructor(
    private formBuilder: FormBuilder,
    private authService: MyAuthService,
    private roomService: RoomService
    // private activatedRoute: ActivatedRoute
  ) {
    this.createNewRoomForm();

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
      ])],

      roomType: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(20)
      ])],

      available: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(10)
      ])],
      image: ['']
    })
  }


  // Enable new room form
  enableFormNewRoomForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable(); // Enable body field
    this.form.get('price').enable(); // Disable title field
    this.form.get('roomType').enable(); // Disable body field
    this.form.get('available').enable(); // Disable title field
  }

  // Disable new room form
  disableFormNewRoomForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('body').disable(); // Disable body field
    this.form.get('price').disable(); // Disable title field
    this.form.get('roomType').disable(); // Disable body field
    this.form.get('available').disable(); // Disable title field
  }

  onRoomSubmit() {

    var imageName = this.form.get('image').value;
    this.roomImage += imageName.slice(imageName.lastIndexOf("\\") + 1);

    console.log("image path = " + this.roomImage);

    console.log("submitting...");

    this.processing = true; // Disable submit button
    // this.disableFormNewRoomForm(); // Lock form

    this.selectedAvail = this.form.get('available').value;
    if (this.selectedAvail == 'yes') {
      this.selectedAvail = true;
    } else this.selectedAvail = false;


    console.log(this.selectedAvail);


    // console.log("room type: " + this.form.get('roomType').value);
    // console.log("available: " + this.form.get('avail').value);

    // Create room object from form fields
    const room = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      price: this.form.get('price').value,
      isBooked: false, // Booked field,
      roomType: this.form.get('roomType').value,
      available: this.selectedAvail,
      image: this.roomImage
    }

    // Function to save room into database
    this.roomService.newRoom(room).subscribe(data => {
      console.log(data);
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

  deleteFromS3(imgName) {
    const params = {
      Bucket: 'ql-cf-templates-1519363680-b85b8fd649cbf407-us-west-2',
      Key:  imgName,
    };

    this.bucket.deleteObject(params, function (err, data) {
      if (err) {
        console.log('There was an error deleting your file: ', err.message);
        return;
      }
      console.log('Successfully deleted file.');
    });
  }


  ngOnInit() {

    this.getAllRooms(); // Get all rooms on component load

    this.bucket = new S3(
      {
        accessKeyId: "AKIAJLU35VQHTE5QKA4Q",
        secretAccessKey: "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",
        region: "us-west-2"
      }
    );
  }

}
