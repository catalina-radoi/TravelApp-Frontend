import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Trip } from '../../@types/Trip';
import { TripService } from '../../_services/trip.service';
import { AlertService } from 'ngx-alerts';
import { User } from '../../@types/User';
import { UserServiceService } from '../../_services/user-service.service';

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.css']
})
export class NewTripComponent implements OnInit {
  public trip: Trip;
  public selectedTrip: Trip;
  public currentTripId: number;
  public currentUser: String;
  public currentUserId: number;
  public users: User[];



  constructor(
    private tripService: TripService,
    private alertService: AlertService,
    private userService: UserServiceService,
  ) { }

  // onSubmit(profileForm: NgForm) {


  //   this.selectedTrip = new Trip();
  //   this.selectedTrip.name = profileForm.value.name;


  //   console.log(profileForm.value);
  //   // { first: '', last: '' }


  // }
  ngOnInit(): void {

    this.currentUser = sessionStorage.getItem('auth-user');

    console.log(this.currentUser);
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;
    this.userService.getUsers().subscribe(users => (this.users = users));

  }
  onCreate() {

    this.tripService.createTrip2(this.currentUserId, 'opened', 'picked-group')
      .subscribe(
        data => {
          window.sessionStorage.setItem('created_trip', JSON.stringify(data));
          this.alertService.success('The trip has been added successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The trip failed to be added');
        });

    this.currentTripId = JSON.parse(sessionStorage.getItem('created_trip')).tripId;
    console.log(this.currentTripId);

    // this.tripService.setAdminTrip(this.currentUserId, this.currentTripId + 1)
    //   .subscribe(
    //     (user: User) => {
    //       this.users.push(user);
    //       this.alertService.success('The admin has been added successfully');
    //     }, (error) => {
    //       console.log(error);
    //       this.alertService.danger('The admin failed to be added');
    //     });


  }

}
