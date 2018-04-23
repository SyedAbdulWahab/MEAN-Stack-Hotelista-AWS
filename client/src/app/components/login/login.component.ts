import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MyAuthService } from '../../services/auth.service';
import { AuthService } from 'angular2-social-login'
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
// import {Angular2SocialLoginModule} from 'angular2-social-login'



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  messageClass;
  message;
  processing = false;
  form;
  previousUrl;
  sub;
  user;
  myJwt;

  constructor(
    private formBuilder: FormBuilder,
    private myAuthService: MyAuthService,
    private authService: AuthService,
    private router: Router,
    private authGuard: AuthGuard
  ) {
    this.createForm(); // Create Login Form when component is constructed
  }

  // Function to create login form
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  }

  // Function to disable form
  disableForm() {
    this.form.controls['username'].disable(); // Disable username field
    this.form.controls['password'].disable(); // Disable password field
  }

  // Function to enable form
  enableForm() {
    this.form.controls['username'].enable(); // Enable username field
    this.form.controls['password'].enable(); // Enable password field
  }

  // Functiont to submit form and login user
  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

    // Function to send login data to API
    this.myAuthService.login(user).subscribe(data => {
      // Check if response was a success or error
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form for editting
      } else {
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = data.message; // Set success message
        // Function to store user's token in client local storage
        this.myAuthService.storeUserData(data.token, data.user);

        localStorage.setItem('username',data.user.username);
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          // Check if user was redirected or logging in for first time
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]); // Redirect to page they were trying to view before
          } else {
            this.router.navigate(['/dashboard']); // Navigate to dashboard view
          }
        }, 2000);
      }
    });
  }

  //social login
  signIn(provider) {
    this.sub = this.authService.login(provider).subscribe(
      newData => {
        console.log("logged in " + newData);
        this.user = newData;

        this.myAuthService.login(this.user).subscribe(data => {
          // Check if response was a success or error
          if (!data.success) {
            this.messageClass = 'alert alert-danger'; // Set bootstrap error class
            this.message = data.message; // Set error message
            this.processing = false; // Enable submit button
            this.enableForm(); // Enable form for editting
          } else {
            this.messageClass = 'alert alert-success'; // Set bootstrap success class
            this.message = data.message; // Set success message
            // Function to store user's token in client local storage
            this.myAuthService.storeUserData(data.token, data.user);

            localStorage.setItem('name',data.name);
            localStorage.setItem('email',data.email);
            localStorage.setItem('image',data.image);

            // After 2 seconds, redirect to dashboard page
            setTimeout(() => {
              // Check if user was redirected or logging in for first time
              if (this.previousUrl) {
                this.router.navigate([this.previousUrl]); // Redirect to page they were trying to view before
              } else {
                this.router.navigate(['/dashboard']); // Navigate to dashboard view
              }
            }, 2000);
          }
        });
      });
  }


  logout() {
    this.authService.logout();
    console.log("logged out ");
    // .subscribe(
    //   (data)=>{
    //     console.log("logged out "+data);
    //     this.user=null;
    //   }
    // )
  }

  ngOnInit() {
    // On page load, check if user was redirected to login
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger'; // Set error message: need to login
      this.message = 'You must be logged in to view that page.'; // Set message
      this.previousUrl = this.authGuard.redirectUrl; // Set the previous URL user was redirected from
      this.authGuard.redirectUrl = undefined; // Erase previous URL
    }
  }

  ngOnDestroy(): void {
    if (this.sub != undefined)
      this.sub.unsubscribe;
  }

}
