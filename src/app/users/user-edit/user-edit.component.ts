import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this .isLoading = true;
    this .authService.createUser(form.value.email, form.value.password);
  }

}
