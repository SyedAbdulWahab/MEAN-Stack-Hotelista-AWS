import { Component, OnInit } from '@angular/core';
import { MyAuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
s3Path = 'https://s3-us-west-2.amazonaws.com/mean-hotelista/';


  constructor(
    public authService: MyAuthService
  ) { }

  ngOnInit() {
  }

}
