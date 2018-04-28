import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RatingModule} from 'ngx-rating'
import {Angular2SocialLoginModule} from 'angular2-social-login'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { RoomComponent } from './components/room/room.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminRoomComponent } from './components/admin-room/admin-room.component';

import { MyAuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { RoomService } from './services/room.service';

import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { DeleteRoomComponent } from './components/admin-room/delete-room/delete-room.component';
import { EditRoomComponent } from './components/admin-room/edit-room/edit-room.component';
import { RatingComponent } from './components/rating/rating.component';
import { AdminReviewComponent } from './components/admin-review/admin-review.component';
import { DeleteReviewComponent } from './components/admin-review/delete-review/delete-review.component';
import { UserComponent } from './components/user/user.component';
import { DeleteUserComponent } from './components/user/delete-user/delete-user.component';
import { UserService } from './services/user.service';
import { ScripthackComponent } from './components/scripthack/scripthack.component';

let providers = {
  "google": {
    "clientId": "327790836312-1s3svsvv7rubtvj7olp4pknfjbbmoaff.apps.googleusercontent.com"
  },
  "facebook": {
    "clientId": "1391401730966008",
    "apiVersion": "v2.12" 
  }
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent,
    DeleteBlogComponent,
    PublicProfileComponent,
    RoomComponent,
    AdminLoginComponent,
    AdminPanelComponent,
    AdminRoomComponent,
    DeleteRoomComponent,
    EditRoomComponent,
    RatingComponent,
    AdminReviewComponent,
    DeleteReviewComponent,
    UserComponent,
    DeleteUserComponent,
    ScripthackComponent

  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    FlashMessagesModule,
    RatingModule,
    Angular2SocialLoginModule
  ],
  providers: [MyAuthService, AuthGuard, NotAuthGuard, BlogService, RoomService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

Angular2SocialLoginModule.loadProvidersScripts(providers);