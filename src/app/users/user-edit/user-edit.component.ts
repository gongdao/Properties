import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  isLoading = false;
  user: User;
  userEditForm: FormGroup;
  private userId: string;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('Begin to edit...');
    this.userEditForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        validators: [Validators.required]
      }),
      role: new FormControl( null, {
        validators: [Validators.required, Validators.max(99), Validators.min(0)]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log('come here.');
      // console.log('userId is ' + paramMap.has('userId'));
      if (paramMap.has('userId')) {
        this .userId = paramMap.get('userId');
        this .isLoading = true;
        console.log('userId is first ' + paramMap.get('userId'));
        this.authService.getUserById(this .userId);
        this .authService.getUserThroughIdUpdated().subscribe(userData => {
          console.log('userData email really is ' + userData.email);
          this .isLoading = false;
          this.user = userData;
          this.userEditForm.setValue({
            'email': userData.email,
            'password': userData.password,
            'role': userData.role
          });
        });
      } else {
        this. user = null;
        this.userId = null;
        console.log('Database reading error.');
      }
    });
  }

  onUpdate(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this .isLoading = true;
    this .authService.updateUser(this.userId, form.value.email, form.value.password, form.value.role);
    this .isLoading = false;
    this.authService.navigate(31);
  }

}
