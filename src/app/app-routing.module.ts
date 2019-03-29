import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UnitCreateComponent } from './Units/unit-create/unit-create.component';
import { UnitListComponent } from './Units/unit-list/unit-list.component';
import { BrowseUnitsComponent } from './browseUnits/browse-units/browse-units.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'listUser', component: UserListComponent },
  { path: 'editUser/:userId', component: UserEditComponent },

  { path: 'createUnit', component: UnitCreateComponent, canActivate: [AuthGuard] },
  { path: 'editUnit/:unitId', component: UnitCreateComponent, canActivate: [AuthGuard] },
  { path: 'listUnit', component: UnitListComponent },

  { path: 'browseUnit', component: BrowseUnitsComponent }
];

@ NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
