//TODO: Resolve Errors

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyAuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  messageClass;
  message;
  loadingUsers = false;
  userPosts;
  newComment = [];
  enabledComments = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: MyAuthService,
    private userService: UserService
  ) {
  }

  // Reload users on current page
  reloadUsers() {
    this.loadingUsers = true; // Used to lock button
    this.getAllUsers(); // Add any new blogs to the page
    setTimeout(() => {
      this.loadingUsers = false; // Release button lock after four seconds
    }, 4000);
  }

  // Function to go back to previous page
  goBack() {
    window.location.reload(); // Clear all variable states
  }

  // Function to get all blogs from the database
  getAllUsers() {
    // Function to GET all users from database
    this.userService.getAllUsers().subscribe(data => {
      this.userPosts = data.users; // Assign array to use in HTML
    });
  }

  ngOnInit() {
    // Get profile username on page load
    this.getAllUsers(); // Get all blogs on component load
  }

}
