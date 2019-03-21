import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { User } from '../user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
   users: User[] = [];
   isLoading = false;
   totalUsers = 0;
   usersPerPage = 2;
   currentPage = 1;
   pageSizeOptions = [1, 2, 5, 10];
   userIsAuthenticated = false;
   private usersSub: Subscription;
   private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this .isLoading = true;
    this .authService.getUsers(this .usersPerPage, this .currentPage);
    this .usersSub = this .authService
      .getUserUpdateListener()
      .subscribe((userData: {users: User[], userCount: number}) => {
          this .isLoading = false;
          this .totalUsers = userData.userCount;
          this .users = userData.users;
      });
      this .userIsAuthenticated = this .authService.getIsAuth();
      this .authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this .userIsAuthenticated = isAuthenticated;
      });
  }
  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this .isLoading = true;
    this .currentPage = pageData.pageIndex + 1;
    this .usersPerPage = pageData.pageSize;
    this .authService.getUsers(this .usersPerPage, this .currentPage);
  }

  onDelete(postId: string) {
    this .isLoading = true;
    this .authService.deleteUser(postId).subscribe(() => {
      this .authService.getUsers(this .usersPerPage, this .currentPage);
    });
  }

  ngOnDestroy() {
   this .usersSub.unsubscribe();
   this .authStatusSub.unsubscribe();
  }
}
