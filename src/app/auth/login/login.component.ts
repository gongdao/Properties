import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@ Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  email = '';

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if ( form.invalid) {
      return;
    }
    this .isLoading = true;
    this.email = form.value.email;
    localStorage.setItem('userName', form.value.email);
    this .authService.login(form.value.email, form.value.password);
    this.authService.checkeRole();
    this.authService.navigate();
  }
}
