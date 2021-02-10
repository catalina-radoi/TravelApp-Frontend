import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FilterPipe } from 'ngx-filter-pipe';
import { AlertService } from 'ngx-alerts';

import { TRIPS } from '../../mockups/mock-Trips';
import { Trip } from '../../@types/Trip';
import { ViewDetailsModalComponent } from './view-details-modal/view-details-modal.component';
import { TripService } from '../../_services/trip.service';
import { UserServiceService } from '../../_services/user-service.service';
import { Group } from '../../@types/Group';
import { PickLocationModalComponent } from './pick-location-modal/pick-location-modal.component';
import { CalendarModalComponent } from './calendar-modal/calendar-modal.component';
import { OfferModalComponent } from './offer-modal/offer-modal.component';


@Component({
  selector: 'app-all-trips',
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.css']
})
export class AllTripsComponent implements OnInit {
  public selectedTrip: Trip;

  public bsModalRef: BsModalRef;
  public tripsFilter: any = { groupTrip: null };
  public tripsFilter2: any = { groupTrip: null };
  public trips: Trip[];
  public currentUser: String;
  public currentUserId: number;
  public tripsAdmin: Trip[];
  public groupsUser: Group[];
  public tripsUsers: Trip[];
  public tripsUsers2: Trip[];
  public tripsUsersNoAdmin: Trip[];

  constructor(
    private modalService: BsModalService,
    private alertService: AlertService,
    private filterPipe: FilterPipe,
    private tripService: TripService,
    private userService: UserServiceService,
  ) { }

  ngOnInit(): void {
    this.currentUser = sessionStorage.getItem('auth-user');

    console.log(this.currentUserId);
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;


    this.tripService.getTrips().subscribe(trips => (this.trips = trips));
    console.log(this.trips);


    // this.tripService.getTripsWhereAdmin(this.currentUserId).subscribe(tripsAdmin => (
    //   this.tripsAdmin = tripsAdmin));

    this.tripService.getTripsWhereAdmin(this.currentUserId).subscribe((tripsAdmin: Trip[]) => {
      this.tripsAdmin = tripsAdmin;
      window.sessionStorage.setItem('trips_admin', JSON.stringify(this.tripsAdmin));
      console.log(this.tripsAdmin);
    });
    this.tripsAdmin = JSON.parse(sessionStorage.getItem('trips_admin'));
    console.log(this.tripsAdmin);



    //TRIP PENTRU GRUPURILE DIN CARE E UN USER

    // this.userService.getGroups(this.currentUserId).subscribe((groups: Group[]) => {
    //   this.groupsUser = groups;

    //   for (let i = 0; i <= this.groupsUser.length; i++) {
    //     this.tripService.getTripsForGroup(this.groupsUser[i].groupId).subscribe((tripUsers: Trip[]) => {

    //       this.tripsUsers = tripUsers;


    //       console.log(this.tripsUsers);
    //       window.sessionStorage.setItem('trips_user', JSON.stringify(this.tripsUsers));

    //       // window.sessionStorage.setItem('trips_admin', JSON.stringify(this.tripsAdmin));

    //     });
    //   }
    // });


    //TRIP PENTRU GRUPURILE DIN CARE E UN USER

    this.tripService.getTripsWhereMemberGroup(this.currentUserId).subscribe((tripsUsers: Trip[]) => {
      this.tripsUsers = tripsUsers;
      window.sessionStorage.setItem('trips_user', JSON.stringify(this.tripsUsers));
      console.log(this.tripsUsers);
    });


  }

  onChange(trip: Trip) {
    this.selectedTrip = trip;
    this.openModalWithComponent3(trip);
  }
  openModalWithComponent3(pSelectedTrip: Trip) {
    const tempState = {
      selectedTrip: { ...pSelectedTrip }
    };
    this.bsModalRef = this.modalService.show(ViewDetailsModalComponent, {
      initialState: tempState,
      class: "modal-lg"
    });
    this.bsModalRef.content.onClose.subscribe(
      (result: Trip) => {
        // set details to selected user from table
        this.selectedTrip.groupName = result.groupName;

      }
    );
  }


  onPickLocation(trip: Trip) {
    this.selectedTrip = trip;
    this.openModalWithComponentLocation(trip);
  }
  openModalWithComponentLocation(pSelectedTrip: Trip) {
    const tempState = {
      selectedTrip: { ...pSelectedTrip }
    };
    this.bsModalRef = this.modalService.show(PickLocationModalComponent, {
      initialState: tempState,
      class: "modal-lg"
    });
    this.bsModalRef.content.onClose.subscribe(
      (result: Trip) => {
        // set details to selected user from table
        this.selectedTrip.groupName = result.groupName;

      }
    );
  }


  onVoteCalendar(trip: Trip) {
    this.selectedTrip = trip;
    this.openModalWithComponentCalendar(trip);
  }
  openModalWithComponentCalendar(pSelectedTrip: Trip) {
    const tempState = {
      selectedTrip: { ...pSelectedTrip }
    };
    this.bsModalRef = this.modalService.show(CalendarModalComponent, {
      initialState: tempState,
      class: "modal-lg"
    });
    this.bsModalRef.content.onClose.subscribe(
      (result: Trip) => {
        // set details to selected user from table
        this.selectedTrip.groupName = result.groupName;

      }
    );
  }


  onVoteOffer(trip: Trip) {
    this.selectedTrip = trip;
    this.openModalWithComponentOffer(trip);
  }
  openModalWithComponentOffer(pSelectedTrip: Trip) {
    const tempState = {
      selectedTrip: { ...pSelectedTrip }
    };
    this.bsModalRef = this.modalService.show(OfferModalComponent, {
      initialState: tempState,
      class: "modal-lg"
    });
    this.bsModalRef.content.onClose.subscribe(
      (result: Trip) => {
        // set details to selected user from table
        this.selectedTrip.groupName = result.groupName;

      }
    );
  }


}
