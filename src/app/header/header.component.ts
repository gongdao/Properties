import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@ Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userName = 'use';

  constructor(private authService: AuthService ) { }

  ngOnInit() {
    // this .userIsAuthenticated = this .authService.getIsAuth();

    this .authListenerSubs = this .authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userName = localStorage.getItem('userName');
        this .userIsAuthenticated = isAuthenticated;

        console.log('this.userName is ' + this.userName);
    });
  }

  onLogout() {
    this .userName = '';
    this .authService.logout();
  }
  ngOnDestroy() {
    this .authListenerSubs.unsubscribe();
  }



}
