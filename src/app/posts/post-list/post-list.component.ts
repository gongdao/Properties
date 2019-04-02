import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';

@ Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  /* posts = [
    {
      title: 'First Post',
      content: 'This is the first post\'s content'
    },
    {
      title: 'Second Post',
      content: 'This is the second post\'s content'
    },
    {
      title: 'Third Post',
      content: 'This is the third post\'s content'
    }
    ]; */
   posts: Post[] = [];
   isLoading = false;
   role: number;
   totalPosts = 0;
   postsPerPage = 5;
   currentPage = 1;
   pageSizeOptions = [5, 10, 15, 20];
   userIsAuthenticated = false;
   private postsSub: Subscription;
   private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this .isLoading = true;
    this.role = this.authService.getUserRole();
    this .postsService.getPosts(this .postsPerPage, this .currentPage);
    this .postsSub = this .postsService
      .getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
          this .isLoading = false;
          this .totalPosts = postData.postCount;
          this .posts = postData.posts;
           console.log('createDate is ' + this.posts[0].createDate);
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
    this .postsPerPage = pageData.pageSize;
    this .postsService.getPosts(this .postsPerPage, this .currentPage);
  }

  onDelete(postId: string) {
    this .isLoading = true;
    this .postsService.deletePost(postId).subscribe(() => {
      this.totalPosts --;
      console.log('current page is ' + this.currentPage);
      if(this.totalPosts % this.postsPerPage === 0 && this.currentPage === 1 + this.totalPosts / this.postsPerPage){
        this.currentPage --;
      }
      console.log('current page is ' + this.currentPage);
      console.log('total page is ' + this.totalPosts);
      console.log('posts per page is ' + this.postsPerPage);
      this .postsService.getPosts(this .postsPerPage, this .currentPage);
    });
  }

  ngOnDestroy() {
   this .postsSub.unsubscribe();
   this .authStatusSub.unsubscribe();
  }
}
