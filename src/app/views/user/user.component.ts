import { Component, OnInit } from '@angular/core';

import { CalendarComponent } from '../new-trip/components/calendar/calendar.component';
import { NgForm } from '@angular/forms';
import { User } from '../../@types/User';
import { AlertService } from 'ngx-alerts';
import { UserServiceService } from '../../_services/user-service.service';
import { first } from 'rxjs/operators';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public user: User;

  public currentUser: User;
  public show: boolean = false;
  public buttonName: any = 'Show';
  onFileChanged(event) {
    const file = event.target.files[0]
  }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }
  }

  onSubmit(profileForm: NgForm) {
    console.log(profileForm.value);
    this.userService.updateUser(this.currentUser.userId, profileForm.value)
      .subscribe(
        data => {


          this.alertService.success('The user has been updated successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The user failed to be updated');
        }
      );
    // for (let i = 0; i < 2; i++) {
    //   if (this.user.id == this.users[i].id) {
    //     this.users[i].userName == profileForm.value.userName;
    //     this.users[i].email == profileForm.value.email;


    //   }
    console.log(profileForm.value);
    // { first: '', last: '' }


  }
  // onSubmit2(changePassForm: NgForm) {
  //   for (let i = 0; i < 2; i++) {
  //     if (this.user.id == this.users[i].id) {


  //       if (changePassForm.value.password1 === changePassForm.value.password2
  //         && changePassForm.value.password3 === this.users[i].password) {
  //         this.users[i].password == changePassForm.value.password1;
  //         console.log('este asa');
  //       }
  //       if (changePassForm.value.password1 != changePassForm.value.password2) {
  //         this.alertService.danger('New password must be the same as confirm password');
  //       }
  //       if (changePassForm.value.password3 !== this.users[i].password) {
  //         console.log('error');
  //         this.alertService.danger('Old password is incorrect');
  //       }
  //       console.log(this.users[i]);
  //     }
  //     console.log(changePassForm.value);
  //     // { first: '', last: '' }

  //   }
  // }

  constructor(
    private alertService: AlertService,
    private userService: UserServiceService,
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('auth-user'));
    console.log(this.currentUser);

    console.log(this.currentUser.userId);
    this.userService.getUserDetails(this.currentUser.userId).subscribe((user: User) => {
      this.user = user;
      window.sessionStorage.setItem('user_details', JSON.stringify(this.user));
      console.log(this.user);
    });
    this.user = JSON.parse(sessionStorage.getItem('user_details'));
    console.log(this.user);
  }


}
