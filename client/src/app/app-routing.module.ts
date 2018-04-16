import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { RoomComponent } from './components/room/room.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import {AdminPanelComponent} from './components/admin-panel/admin-panel.component'
import { AdminRoomComponent } from './components/admin-room/admin-room.component';
import { DeleteRoomComponent } from './components/admin-room/delete-room/delete-room.component';
import { EditRoomComponent } from './components/admin-room/edit-room/edit-room.component';
import { BlogComponent } from './components/blog/blog.component';
import { RatingComponent } from './components/rating/rating.component';
import { UserComponent } from './components/user/user.component';
import { DeleteUserComponent } from './components/user/delete-user/delete-user.component';
import { AdminReviewComponent } from './components/admin-review/admin-review.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';

// Our Array of Angular 2 Routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // Default Route
  },
  {
    path: 'dashboard',
    component: DashboardComponent, // Dashboard Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'register',
    component: RegisterComponent, // Register Route
    canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
  },
  {
    path: 'login',
    component: LoginComponent, // Login Route
    canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
  },
  {
    path: 'profile',
    component: ProfileComponent, // Profile Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'room',
    component: RoomComponent, // Blog Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'blog',
    component: BlogComponent, // Blog Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'user',
    component: UserComponent, // Blog Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'edit-room/:id',
    component: EditRoomComponent, // Edit Blog Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'delete-room/:id',
    component: DeleteRoomComponent, // Delete Blog Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'delete-blog/:id',
    component: DeleteBlogComponent, // Delete Blog Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'delete-user/:id',
    component: DeleteUserComponent, // Delete Blog Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, // Public Profile Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'admin',
    component: AdminLoginComponent, // Dashboard Route,
    canActivate: [NotAuthGuard] // User must be logged in to view this route
  },
  {
    path: 'adminPanel',
    component: AdminPanelComponent, // Dashboard Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'adminRoom',
    component: AdminRoomComponent, // Dashboard Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'adminReview',
    component: AdminReviewComponent, // Dashboard Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'rating',
    component: RatingComponent, // Dashboard Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  { path: '**', component: HomeComponent } // "Catch-All" Route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }
