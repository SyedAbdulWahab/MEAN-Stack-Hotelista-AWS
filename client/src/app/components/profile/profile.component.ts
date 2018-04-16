import { Component, OnInit } from '@angular/core';
import { MyAuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username = '';
  email = '';
  image = 'http://www.planystech.com/wp-content/uploads/2017/03/profile-placeholder.jpg';

  constructor(
    private authService: MyAuthService
  ) { }

  ngOnInit() {

    var provider = localStorage.getItem('_login_provider');

    if (provider == 'google' || provider == 'facebook') {
      console.log("Social Login");
      this.username = localStorage.getItem('name');
      this.email = localStorage.getItem('email'); 
      this.image = localStorage.getItem('image');

    }
    else {
      console.log("Normal Login");
      // Once component loads, get user's data to display on profile
      this.authService.getProfile().subscribe(profile => {
        this.username = profile.user.username; // Set username
        this.email = profile.user.email; // Set e-mail
      });
    }



  }

}
