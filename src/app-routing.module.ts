import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent } from './app/posts/post-list/post-list.component';
import { PostCreateComponent } from './app/posts/post-create/post-create.component';
import { LoginComponent } from './app/auth/login/login.component';
import { UserEditComponent } from './app/users/user-edit/user-edit.component';
import { UserListComponent } from './app/users/user-list/user-list.component';


const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateComponent },
  { path: 'edit/:postId', component:  PostCreateComponent},
  { path: 'login', component: LoginComponent },
  { path: 'editUser/:userId', component: UserEditComponent},
  { path: 'listUser', component: UserListComponent}
];

@ NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
