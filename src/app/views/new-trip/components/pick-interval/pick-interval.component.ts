import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, NgModel, FormGroupDirective } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { PickIntervalService } from './pick-interval.service';
import { TripService } from '../../../../_services/trip.service';
import { UserServiceService } from '../../../../_services/user-service.service';
import { Trip } from '../../../../@types/Trip';
import { Choice } from '../../../../@types/Choice';
import { AlertService } from 'ngx-alerts';
import { Group } from '../../../../@types/Group';
import { Poll } from '../../../../@types/Poll';
import { Vote } from '../../../../@types/Vote';



@Component({
  selector: 'app-pick-interval',
  templateUrl: './pick-interval.component.html',
  styleUrls: ['./pick-interval.component.css']
})
export class PickIntervalComponent implements OnInit {


  public href: string = '';
  public nextUrl: string = '/new-trip/picked-group/pick-interval/calendar';
  public currentUser: String;
  public currentUserId: number;
  public tripsAdmin: Trip;
  public choices: Choice[];
  public currentPollId: number;
  public currentTripId: number;
  public currentTripGroup: Group;
  public currentTripGroupId: number;
  public pollCurent: string;
  public votes: Vote[];
  public currentTrip: Trip;

  model = new Poll();






  constructor(private router: Router,
    private data: PickIntervalService,
    private tripService: TripService,
    private userService: UserServiceService,
    private alertService: AlertService,
  ) { }


  @ViewChild('pollForm', { static: false })
  pollForm: FormGroupDirective;



  onSubmit(f: NgForm): any {
    // console.log(f.value.start, f.value.end);
    // window.sessionStorage.setItem('start_interval', JSON.stringify(f.value.start));
    // window.sessionStorage.setItem('end_interval', JSON.stringify(f.value.end));
    this.tripService.updateIntervalTrip(this.currentTripId, f.value.start, f.value.end, 'calendar')
      .subscribe(
        data => {


          this.alertService.success('The interval has been updated successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The interval failed to be updated');
        }
      );

  }


  ngOnInit() {
    this.pollCurent = 'nu';

    this.href = this.router.url;

    this.currentUser = sessionStorage.getItem('auth-user');

    console.log(this.currentUser);
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;

    console.log(this.currentUserId);

    //ia trip OPENED

    this.tripService.getTripsWhereAdmin(this.currentUserId).subscribe((tripsAdmin: Trip[]) => {

      for (let i = 0; i <= (tripsAdmin.length - 1); i++) {
        if (tripsAdmin[i].status == 'opened') {
          // if (tripsAdmin != null) {
          //   this.user1 = 'admin-poll';
          //   console.log(this.user1);
          // }

          this.tripsAdmin = tripsAdmin[i];
          console.log(this.tripsAdmin);
          window.sessionStorage.setItem('trip_opened', JSON.stringify(this.tripsAdmin));
        }
      }

      // window.sessionStorage.setItem('trips_admin', JSON.stringify(this.tripsAdmin));

    });
    // ia trip curent

    if (JSON.parse(sessionStorage.getItem('created_trip'))) {
      this.currentTripId = JSON.parse(sessionStorage.getItem('created_trip')).tripId;
      console.log(this.currentTripId);

      // ia grup trip curent


      this.tripService.getGroupTrip(this.currentTripId).subscribe((group: Group) => {
        this.currentTripGroup = group;
        this.currentTripGroupId = this.currentTripGroup.groupId;
        console.log(this.currentTripGroup);
      });

    } else if (JSON.parse(sessionStorage.getItem('trip_opened'))) {
      this.currentTripId = JSON.parse(sessionStorage.getItem('trip_opened')).tripId;
      this.currentTrip = JSON.parse(sessionStorage.getItem('trip_opened'))
      console.log(this.currentTripId);

      // ia grup trip curent

      this.tripService.getGroupTrip(this.currentTripId).subscribe((group: Group) => {
        this.currentTripGroup = group;
        this.currentTripGroupId = this.currentTripGroup.groupId;
        console.log(this.currentTripGroup);
      });




    }



    // get current poll
    if (JSON.parse(sessionStorage.getItem('poll_nou_calendar'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_nou_calendar')).id;

      // IA POLL CARE E OPENED
    } else if (JSON.parse(sessionStorage.getItem('poll_opened_calendar'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_opened_calendar')).id;

      this.pollCurent = 'opened';

    }






  }

  onSave() {

  }

  onCreate(pollForm: NgForm) {
    console.log(pollForm.value.question);
    this.tripService.createPoll(this.currentUserId, this.currentTripGroup.groupId, this.currentTripId, this.pollForm.value.question, 'opened', 'calendar')
      .subscribe(
        data => {

          window.sessionStorage.setItem('poll_nou_calendar', JSON.stringify(data));

          this.alertService.success('The poll has been added successfully');
          this.tripService.getChoices(this.currentPollId).subscribe(choices => (this.choices = choices));
          console.log(this.choices);
        }, (error) => {
          console.log(error);
          this.alertService.danger('The poll failed to be added');
        });

    this.currentPollId = JSON.parse(sessionStorage.getItem('poll_nou_calendar')).id;
    console.log(this.currentPollId);


  }



}
