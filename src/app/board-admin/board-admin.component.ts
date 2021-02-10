import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FilterPipe } from 'ngx-filter-pipe';
import { AlertService } from 'ngx-alerts';

import { Trip } from '../@types/Trip';
import { ViewDetailsModalComponent } from './../../app/views/all-trips/view-details-modal/view-details-modal.component';
import { TripService } from '../_services/trip.service';
import { UserService } from '../_services/user.service';
import { Group } from '../@types/Group';

import { UserServiceService } from '../_services/user-service.service';
import { User } from '../@types/User';


@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content = '';
  public selectedTrip: Trip;
  public tripsFilter: any = { groupTrip: null };
  public groupFilter: any = { groupName: null };
  public trips: Trip[];
  public currentUser: String;
  public currentUserId: number;
  public selectedGroup: Group;
  public users: User[];

  public groups: Group[];

  public bsModalRef: BsModalRef;

  constructor(
    private userService: UserService,
    private tripService: TripService,
    private filterPipe: FilterPipe,
    private modalService: BsModalService,
    private userServiceService: UserServiceService,

  ) { }

  ngOnInit() {
    this.userService.getAdminBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );

    this.currentUser = sessionStorage.getItem('auth-user');

    console.log(this.currentUser);
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;


    this.tripService.getTrips().subscribe(trips => (this.trips = trips));
    console.log(this.trips);
    this.userServiceService.getAllGroups().subscribe(groups => (this.groups = groups));


    console.log(this.groups);
    this.userServiceService.getUsers().subscribe(users => (this.users = users));

  }
  onDelete(trip: Trip) {

  }
  onDelete2(group: Group) {

  }
  onDelete3(user: User) {

  }

}
