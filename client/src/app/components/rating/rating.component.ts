import { Component, OnInit } from '@angular/core';
import { RatingModule } from 'ngx-rating';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyAuthService } from '../../services/auth.service';
import { RoomService } from '../../services/room.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {

rate;
processing = false;
form;
username;
messageClass;
message;
router;

  constructor(
    // private formBuilder: FormBuilder,
    private authService: MyAuthService,
    private roomService: RoomService
  ) { 
    this.router = Router;
    // this.createRatingForm();
  }

  // createRatingForm(){
  //   rating: ['', Validators.compose([
  //     Validators.required
  //   ])]
  // }

  onRatingFormSubmit() {
    const obj = {
      score: this.rate,
      ratedBy: this.username
    }

    this.roomService.newRating(obj).subscribe(data => {
      // Check if Room was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = "Something's Wrong!"; // Return error message
        this.processing = false; // Enable submit button
        // this.enableFormNewRoomForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = "Success!"; // Return success message
        
        
      }

      setTimeout(() => {
        // this.newPost = false; // Hide form
        this.processing = false; // Enable submit button
        this.message = false; // Erase error/success message
        // this.form.reset(); // Reset all form fields
        // this.enableFormNewRoomForm(); // Enable the form fields

      }, 2000);

    });

  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new room posts and comments
    });
  }

}
